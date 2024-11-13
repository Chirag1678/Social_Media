import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js"; 

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query; //get query parameters

    //set query parameters
    const queryParam = {
        ...(query && { title: { $regex: query, $options: "i" } }),
        ...(userId && { owner: userId }),
        ...(sortBy && { [sortBy]: sortType === "desc" ? -1 : 1 }),
        page,
        limit,
    };

    //
    var aggregate = Video.aggregate([
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
    ]);

    //get videos based on query parameters
    const videos = await Video.aggregatePaginate(aggregate,queryParam,(err,res)=>{
        if(err){
            throw new ApiError(500, "Error fetching videos",err, err.stack);
        }
        return res;
    }); //paginate videos

    //return success response
    res.status(200).json(new ApiResponse(200, videos, "Videos found"));
})

const publishAVideo = asyncHandler(async (req, res) => {
    //get video and thumbnail from req.files
    const { title, description} = req.body

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
    //create video and save to database
    const video = new Video({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        owner: req.user._id,
        duration: videoFile.duration
    })

    //check if video is created
    if(!video){
        throw new ApiError(500, "Error creating video")
    }

    //save video to database
    await video.save()

    //return success response
    res.status(201).json(new ApiResponse(201, {video, videoFile, thumbnail}, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    //get videoId from req.params
    const { videoId } = req.params

    //check if videoId is valid
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id"); //return error if videoId is invalid
    }

    //find video by id
    const video = await Video.findById(videoId).populate("owner", "username email")

    //check if video is found
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    //if video is found, increment views and add it to user watch history
    video.views += 1;
    await video.save();
    const user = await User.findById(req.user._id);
    user.watchHistory.push(video._id);
    await user.save();

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
    const { title, description } = req.body;

    //get thumbnail from req.file
    let thumbnailLocalPath;
    thumbnailLocalPath = req.file?.path;
    
    //check if title, description or thumbnail is provided
    if(!(title || description || thumbnailLocalPath)){
        throw new ApiError(400, "Nothing to update");
    }

    //if thumbnail is provided, upload to cloudinary
    const thumbnail = thumbnailLocalPath ? await uploadOnCloudinary(thumbnailLocalPath) : null;
    
    if(thumbnailLocalPath && !thumbnail){
        throw new ApiError(500, "Error uploading thumbnail")
    }

    //if thumbnail is updated, delete old thumbnail from cloudinary
    if(thumbnailLocalPath){
        const oldThumbnail = await Video.findById(videoId).select("thumbnail");
        // const oldThumbnail = await Video.aggregate([
        //     {
        //         $match: {
        //             _id: new mongoose.Types.ObjectId(videoId)
        //         }
        //     },
        //     {
        //         $project: {
        //             thumbnail: 1
        //         }
        //     },
        //     {
        //         $addFields:{
        //             thumbnail:{
        //                 $toString: "$thumbnail",
        //             }
        //         }
        //     }
        // ]);
        console.log(typeof oldThumbnail, oldThumbnail.thumbnail.split("/").pop().split(".")[0]);
        const oldThumbnailId = oldThumbnail.thumbnail.split("/").pop().split(".")[0];
        await deleteFromCloudinary(oldThumbnailId); //delete old thumbnail from cloudinary
    }

    //get video from database and patch the details
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                //update thumbnail if provided
                ...(thumbnailLocalPath && { thumbnail: thumbnail.url })
            }
        },
        { new: true }
    );

    //check if video is updated
    if(!video){
        throw new ApiError(500, "Error updating video")
    }

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