import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    // console.log(req.user);
    const userId = req.user._id;
    //check if the user is a valid user
    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    const totalVideos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $addFields: {
                totalViews: {$sum: "$views"} //sum the total views
            }
        },
        {
            $project: {
                totalViews: 1,
                totalVideos: {$sum: 1} //count the total videos
            }
        }
    ]);
    const totalSubscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project: {
                totalSubscribers: {$sum: 1}, //count the total subscribers
                _id: 0
            }
        }
    ])
    const totalLikes = await Like.aggregate([
        {
            $match: {}
        },
        {
            $count: "totalLikes" //count the total likes
        }
    ]);

    //check if data is fetched
    if(!totalVideos || !totalSubscribers || !totalLikes){
        throw new ApiError(500, "Error fetching channel stats");
    }

    //return success response
    const data= {
        totalVideos: totalVideos[0]?.totalVideos || 0,
        totalViews: totalVideos[0]?.totalViews || 0,
        totalSubscribers: totalSubscribers[0]?.totalSubscribers || 0,
        totalLikes: totalLikes[0]?.totalLikes || 0
    }
    res.status(200).json(new ApiResponse(200, data, "Channel stats fetched"));
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user._id;
    //check if the user is a valid user
    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }
    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $project: {
                title: 1,
                thumbnail: 1,
                views: 1,
                createdAt: 1
            }
        },
        {
            $addFields:{
                totalVideos: {$sum: 1}
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    //check if data is fetched
    if(!videos){
        throw new ApiError(500, "Error fetching channel videos");
    }

    //return success response
    res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched"));
})

export { getChannelStats, getChannelVideos };