import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { addTweet } from "../../../frontend/src/store/tweetSlice.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //get videoId from req.params
    const {videoId} = req.params;

    //check if videoId is valid
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    //get query params
    const {page = 1, limit = 10} = req.query;

    //get comments for the video
    const comments = await Comment.aggregatePaginate(
        Comment.aggregate([
            {
                $match: {video: new mongoose.Types.ObjectId(videoId)}
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
                        }
                    ]
                } 
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "comment",
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
        ]),
        {
            page,
            limit
        }
    );

    //return success response
    res.status(200).json(new ApiResponse(200, comments, "Comments found"));

})

const addComment = asyncHandler(async (req, res) => {
    //get videoId from req.params
    const {videoId} = req.params;

    //check if videoId is valid
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id");
    }

    //get comment content from req.body
    const {content} = req.body;

    //check if content is provided
    if(!content){
        throw new ApiError(400, "Content is required");
    }

    //get user id from req.user
    const userId = req.user._id;

    //create a new comment
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    });

    //check if comment is created
    if(!comment){
        throw new ApiError(500, "Error creating comment");
    }

    // Fetch the newly added comment in the desired format
    const [populatedComment] = await Comment.aggregate([
        {
            $match: { _id: comment._id },
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
                foreignField: "comment",
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
    ]);
    
    //return success response
    res.status(201).json(new ApiResponse(200, populatedComment, "Comment added successfully"));
})

const getTweetComments = asyncHandler(async (req, res) => {
    //get tweetId from req.params
    const {tweetId} = req.params;

    //check if videoId is valid
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id");
    }

    //get query params
    const {page = 1, limit = 10} = req.query;

    //get comments for the video
    const comments = await Comment.aggregatePaginate(
        Comment.aggregate([
            {
                $match: {tweet: new mongoose.Types.ObjectId(tweetId)}
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
                        }
                    ]
                } 
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "comment",
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
        ]),
        {
            page,
            limit
        }
    );

    //return success response
    res.status(200).json(new ApiResponse(200, comments, "Comments found"));

})

const addTweetComment = asyncHandler(async (req, res) => {
    //get tweetId from req.params
    const {tweetId} = req.params;

    //check if tweetId is valid
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id");
    }

    //get comment content from req.body
    const {content} = req.body;

    //check if content is provided
    if(!content){
        throw new ApiError(400, "Content is required");
    }

    //get user id from req.user
    const userId = req.user._id;

    //create a new comment
    const comment = await Comment.create({
        content,
        tweet: tweetId,
        owner: userId
    });

    //check if comment is created
    if(!comment){
        throw new ApiError(500, "Error creating comment");
    }

    // Fetch the newly added comment in the desired format
    const [populatedComment] = await Comment.aggregate([
        {
            $match: { _id: comment._id },
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
                foreignField: "comment",
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
    ]);
    
    //return success response
    res.status(201).json(new ApiResponse(200, populatedComment, "Comment added successfully"));
})

const updateComment = asyncHandler(async (req, res) => {
    //get commentId from req.params
    const {commentId} = req.params;

    //check if commentId is valid
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id");
    }

    //get content from req.body
    const {content} = req.body;

    //check if content is provided
    if(!content){
        throw new ApiError(400, "Nothing to update");
    }

    //get user id from req.user
    const userId = req.user._id;

    //check if owner is updating the comment
    const comment = await Comment.findById(commentId);
    if(comment.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to update this comment");
    }

    //check if comment exists
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }
    
    //update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {content}
        },
        {new: true} //return updated comment
    )

    //check if comment is updated
    if(!updatedComment){
        throw new ApiError(500, "Error updating comment");
    }

    //return success response
    res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated successfully"));
})

const deleteComment = asyncHandler(async (req, res) => {
    //get commentId from req.params
    const {commentId} = req.params;

    //check if commentId is valid
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id");
    }

    //get user id from req.user
    const userId = req.user._id;

    //check if owner is deleting the comment
    const comment = await Comment.findById(commentId);
    if(comment.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    //check if comment exists
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }

    //delete the comment
    await comment.deleteOne();

    //return success response
    res.status(200).json(new ApiResponse(200, null, "Comment deleted successfully"));
})

export { getVideoComments, addComment, getTweetComments, addTweetComment, updateComment, deleteComment };