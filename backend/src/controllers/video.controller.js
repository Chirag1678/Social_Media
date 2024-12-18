import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js"; 

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query; //get query parameters
    // console.log(req.query);

    // Validate pagination parameters
    const pageNumber = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * pageSize;

    //set query parameters
    const queryParam = {
        ...(userId && { owner: userId }),
        ...(sortBy && { [sortBy]: sortType === "desc" ? -1 : 1 }),
    };

    //
    var aggregate = Video.aggregate([
        {
            $match: {
                ...(query && { title: { $regex: query, $options: 'i'}})
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            avatar: 1
                        }
                    },
                ]
            }
        },
        {
            $skip: skip,  // Skip documents for pagination
        },
        {
            $limit: pageSize,  // Limit the results based on the page size
        },
    ]);

    //get videos based on query parameters
    const videos = await Video.aggregatePaginate(aggregate,queryParam); //paginate videos

    //if no video is found, return error
    if(!videos){
        throw new ApiError(500, "Error getting videos");
    }

    //return success response
    res.status(200).json(new ApiResponse(200, videos, "Videos found"));
})

const publishAVideo = asyncHandler(async (req, res) => {
    //get video and thumbnail from req.files
    const { title, description, status} = req.body

    //check if title and description are provided
    if(!title || !description){
        throw new ApiError(400, "Title and description are required")
    }

    //check for video and thumbnail
    const videoFileLocalPath = req.files?.videoFile[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    //check if video and thumbnail are provided
    if(!videoFileLocalPath || !thumbnailLocalPath){
        throw new ApiError(400, "Video and thumbnail are required")
    }

    //upload video and thumbnail to cloudinary
    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    //check if video and thumbnail are uploaded
    if(!videoFile || !thumbnail){
        throw new ApiError(500, "Error uploading video and thumbnail")
    }

    // Determine isPublished value based on status
    const isPublished = status === 'public';

    //create video and save to database
    const newVideo = new Video({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        owner: req.user._id,
        duration: videoFile.duration,
        isPublished
    })

    //save video to database
    await newVideo.save()

    // Use an aggregation pipeline to format the response
    const [video] = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(newVideo._id)
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                views: 0,
            },
        },
    ]);

    //check if video is created
    if(!video){
        throw new ApiError(500, "Error creating video")
    }

    //return success response
    res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    //get videoId from req.params
    const { videoId } = req.params

    //check if videoId is valid
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id"); //return error if videoId is invalid
    }

    // Increment views
    await Video.findByIdAndUpdate(
        videoId,
        { $inc: { views: 1 } },
        { new: true }
    );

    //find video by id
    const [video] = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            avatar: 1,
                        },
                    },
                ],
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes",
                pipeline: [
                    {
                        $count: "likes",
                    },
                ],
            },
        },
        {
            $unwind: "$owner",
        },
        {
            $addFields: {
                likes: { $ifNull: [{ $arrayElemAt: ["$likes.likes", 0] }, 0] }, // Handle case with no likes
            },
        },
        {
            $limit: 1,
        },
    ]);

    // Check if video is found
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Get the user and update the watch history only if videoId is not present
    const user = await User.findById(req.user._id);

    if (!user.watchHistory.includes(videoId)) {
        user.watchHistory.push(videoId);
        await user.save();
    }

    //return success response
    res.status(200).json(new ApiResponse(200, {video,user}, "Video found"))
})

const updateVideo = asyncHandler(async (req, res) => {
    //get videoId from req.params
    const { videoId } = req.params;

    //check if videoId is valid
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id"); //return error if videoId is invalid
    }

    //get title, description from req.body
    const { title, description, status } = req.body;

    //get thumbnail from req.file
    let thumbnailLocalPath;
    thumbnailLocalPath = req.file?.path;
    
    //check if title, description or thumbnail is provided
    if(!(title || description || thumbnailLocalPath)){
        throw new ApiError(400, "Nothing to update");
    }

    // Get the existing video
    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    //if thumbnail is provided, upload to cloudinary
    const thumbnail = thumbnailLocalPath ? await uploadOnCloudinary(thumbnailLocalPath) : null;
    
    if(thumbnailLocalPath && !thumbnail){
        throw new ApiError(500, "Error uploading thumbnail")
    }

    //if thumbnail is updated, delete old thumbnail from cloudinary
    if(thumbnailLocalPath){
        const oldThumbnail = await Video.findById(videoId).select("thumbnail");
        // console.log(typeof oldThumbnail, oldThumbnail.thumbnail.split("/").pop().split(".")[0]);
        const oldThumbnailId = oldThumbnail.thumbnail.split("/").pop().split(".")[0];
        await deleteFromCloudinary(oldThumbnailId); //delete old thumbnail from cloudinary
    }

     // Check and toggle publish status if needed
     const published = status === "public"
     if(published!==video.isPublished){
        video.isPublished = published;
     }

    // Update other fields
    video.title = title || video.title;
    video.description = description || video.description;
    if (thumbnail) {
        video.thumbnail = thumbnail.url;
    }

    // Save the updated video
    await video.save();

    //return success response
    res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
})

const deleteVideo = asyncHandler(async (req, res) => {
    //get videoId from req.params
    const { videoId } = req.params;

    //check if videoId is valid
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id"); //return error if videoId is invalid
    }

    //get video from database
    const video = await Video.findById(videoId);

    //check if video is found
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    //get video and thumbnail url and delete from cloudinary
    const videoFileId = video.videoFile.split("/").pop().split(".")[0];
    const thumbnailId = video.thumbnail.split("/").pop().split(".")[0];
    await deleteFromCloudinary(videoFileId); //delete video and thumbnail from cloudinary
    await deleteFromCloudinary(thumbnailId); //delete video and thumbnail from cloudinary

    //delete video from database
    await video.deleteOne();

    //return success response
    res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"));
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    //get videoId from req.params
    const { videoId } = req.params;

    //check if videoId is valid
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id"); //return error if videoId is invalid
    }

    //get video from database
    const video = await Video.findById(videoId);

    //check if video is found
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    //toggle publish status
    video.isPublished = !video.isPublished;
    await video.save();

    //return success response
    res.status(200).json(new ApiResponse(200, video, "Publish status toggled successfully"));
})

export {getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus} //export the functions to be used in the routes