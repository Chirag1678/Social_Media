import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    //get videoId from req.params
    const {videoId} = req.params;

    //get userId from req.user
    const userId = req.user._id;

    //check if videoId is valid
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    //check if userId is valid
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    //check if user has liked the video
    const like = await Like.findOne({video:videoId, likedBy: userId});

    //if user has liked the video, unlike the video
    if(like){
        await like.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Video unliked successfully"));
    }

    //like the video
    const likedVideo = await Like.create({video: videoId, likedBy: userId});

    //check if video is liked
    if(!likedVideo){
        throw new ApiError(500, "Error liking video");
    }

    //return success response
    res.status(200).json(new ApiResponse(200, {likedVideo}, "Video liked successfully"));
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    //get commentId from req.params
    const {commentId} = req.params;

    //get userId from req.user
    const userId = req.user._id;

    //check if commentId is valid
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id");
    }

    //check if userId is valid
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    //check if user has liked the comment
    const like = await Like.findOne({comment: commentId, likedBy: userId});

    //if user has liked the comment, unlike the comment
    if(like){
        await like.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Comment unliked successfully"));
    }

    //like the comment
    const likedComment = await Like.create({comment: commentId, likedBy: userId});

    //check if comment is liked
    if(!likedComment){
        throw new ApiError(500, "Error liking comment");
    }

    //return success response
    res.status(200).json(new ApiResponse(200, {likedComment}, "Comment liked successfully"));
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    //get tweetId from req.params
    const {tweetId} = req.params;

    //get userId from req.user
    const userId = req.user._id;

    //check if tweetId is valid
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id");
    }

    //check if userId is valid
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    //check if user has liked the tweet
    const like = await Like.findOne({tweet: tweetId, likedBy: userId});

    //if user has liked the tweet, unlike the tweet
    if(like){
        await like.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Tweet unliked successfully"));
    }

    //like the tweet
    const likedTweet = await Like.create({tweet: tweetId, likedBy: userId});

    //check if tweet is liked
    if(!likedTweet){
        throw new ApiError(500, "Error liking tweet");
    }

    //return success response
    res.status(200).json(new ApiResponse(200, {likedTweet}, "Tweet liked successfully"));
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //get userId from req.user
    const userId = req.user._id;

    //check if userId is valid
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    //get all videos liked by the user
    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            }
        },
        {
            $unwind: "$video"
        },
        {
            $lookup: {
                from: "users",
                localField: "video.owner",
                foreignField: "_id",
                as: "video.owner"
            }
        },
        {
            $project: {
                _id: "$video._id",
                videoFile: "$video.videoFile",
                title: "$video.title",
                description: "$video.description",
                thumbnail: "$video.thumbnail",
                owner: "$video.owner",
                views: "$video.views",
                createdAt: "$video.createdAt",
                isPublished: "$video.isPublished"
            }
        },
    ]);

    //check if liked videos are found
    if(!likedVideos){
        throw new ApiError(404, "No liked videos found");
    }

    //return success response
    res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
})

const isLikedVideo = asyncHandler(async (req, res) => {
    //get videoId from req.params
    const {videoId} = req.params;

    //get userId from req.user
    const userId = req.user._id;

    //check if videoId is valid
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    //check if userId is valid
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    //check if user has liked the video
    const like = await Like.findOne({video: videoId, likedBy: userId});

    //return success response
    res.status(200).json(new ApiResponse(200, {isLiked: like ? true : false}, "Video like status fetched successfully"));
})

const isLikedComment = asyncHandler(async (req, res) => {
    //get commentId from req.params
    const {commentId} = req.params;

    //get userId from req.user
    const userId = req.user._id;

    //check if commentId is valid
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id");
    }

    //check if userId is valid
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    //check if user has liked the comment
    const like = await Like.findOne({comment: commentId, likedBy: userId});

    //return success response
    res.status(200).json(new ApiResponse(200, {isLiked: like ? true : false}, "Comment like status fetched successfully"));
})

const isLikedTweet = asyncHandler(async (req, res) => {
    //get tweetId from req.params
    const {tweetId} = req.params;

    //get userId from req.user
    const userId = req.user._id;

    //check if tweetId is valid
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id");
    }

    //check if userId is valid
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    //check if user has liked the tweet
    const like = await Like.findOne({tweet: tweetId, likedBy: userId});

    //return success response
    res.status(200).json(new ApiResponse(200, {isLiked: like ? true : false}, "Tweet like status fetched successfully"));
})

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos, isLikedVideo, isLikedComment, isLikedTweet };