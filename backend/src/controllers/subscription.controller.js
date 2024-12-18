import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    // get channelId from req.params
    const {channelId} = req.params;

    // check if channelId is valid
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id"); // return error if channelId is invalid
    }

    // get subscriberId from req.user
    const subscriberId = req.user._id;

    // check if subscriberId is valid
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscriber id"); // return error if subscriberId is invalid
    }

    // check if subscriber is already subscribed to the channel
    const subscription = await Subscription.findOne({channel: channelId, subscriber: subscriberId});

    // if subscription is found, delete the subscription
    if(subscription){
        await subscription.deleteOne();
        return res.status(200).json(new ApiResponse(200, null, "Subscription removed successfully"));
    }

    // if subscription is not found, create a new subscription
    const subscribed = await Subscription.create({channel: channelId, subscriber: subscriberId});

    // return success response
    res.status(200).json(new ApiResponse(200, subscribed , "Subscription added successfully"));
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    // get channelId from req.params
    const {channelId} = req.params;

    // check if channelId is valid
    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "Invalid channel id"); // return error if channelId is invalid
    }

    // get subscribers of the channel
    const subscribers = await Subscription.aggregate([
        {
            $match: {channel: new mongoose.Types.ObjectId(channelId)}
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber"
            }
        },
        {
            $unwind: "$subscriber"
        },
        {
            $project: {
                "subscriber._id": 1,
                "subscriber.username": 1,
                "subscriber.email": 1
            }
        }
    ]);

    // return success response
    res.status(200).json(new ApiResponse(200, subscribers, "Subscribers found"));
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    // get subscriberId from req.params
    const subscriberId = req.user?._id;

    // check if subscriberId is valid
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid subscriber id"); // return error if subscriberId is invalid
    }

    // get channels to which user has subscribed
    const subscribedChannels = await Subscription.aggregate([
        {
            $match: {
                // find subscriptions of the user
                subscriber: new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel"
            }
        },
        {
            $unwind: "$channel"
        },
        {
            $project: {
                "channel._id": 1,
                "channel.username": 1,
                "channel.fullName": 1,
                "channel.avatar": 1,
                "channel.description": 1,
            }
        }
    ]);

    // return success response
    res.status(200).json(new ApiResponse(200, subscribedChannels, "Subscribed channels found"));
})

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };