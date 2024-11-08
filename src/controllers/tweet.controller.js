import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/apiError.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //get content from req.body and image from req.file
    const { content } = req.body;
    const image = req.file ? req.file.path : null;

    //check if content is provided
    if(!content){
        throw new ApiError(400, "Content is required")
    }

    //check if user exists
    const user = await User.findById(req.user._id);

    if(!user){
        throw new ApiError(404, "User not found")
    }

    //if image is provided, upload to cloudinary
    const imageLink = image ? await uploadOnCloudinary(image) : null;

    //if image is uploaded, delete from local storage
    if(image && !imageLink){
        throw new ApiError(500, "Error uploading image")
    }

    //create tweet
    const tweet = await Tweet.create({
        content,
        //if image is uploaded, save image url
        image: imageLink ? imageLink.url : null,
        owner: user._id
    })

    //check if tweet is created
    if(!tweet){
        throw new ApiError(500, "Error creating tweet")
    }

    //return success response
    res.status(201).json(new ApiResponse(201, {tweet}, "Tweet created successfully"));
})

const getUserTweets = asyncHandler(async (req, res) => {
   //get userId from req.params
    const { userId } = req.params;

    //check if userId is valid
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id"); //return error if userId is invalid
    }

    //find user by id
    const user = await User.findById(userId);

    //check if user is found
    if(!user){
        throw new ApiError(404, "User not found")
    }

    //find tweets by user
    const tweets = await Tweet.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(userId) }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $project: {
                "owner.password": 0,
                "owner.email": 0,
                "owner.createdAt": 0,
                "owner.updatedAt": 0,
                "owner.refreshToken": 0,
                "owner.watchHistory": 0,
                "owner.__v": 0
            }
        }
    ]);

    //return success response
    res.status(200).json(new ApiResponse(200, {tweets}, "User tweets found"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    //get tweetId from req.params
    const { tweetId } = req.params;

    //check if tweetId is valid
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id"); //return error if tweetId is invalid
    }

    //find tweet by id
    const tweet = await Tweet.findById(tweetId);

    //check if tweet is found
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    //check if user is authorized to update tweet
    if(req.user._id.toString() !== tweet.owner.toString()){
        throw new ApiError(401, "Unauthorized")
    }

    //get content from req.body and image from req.file
    const { content } = req.body;
    const image = req.file ? req.file.path : null;

    //check if content or image is provided
    if(!content && !image){
        throw new ApiError(400, "Nothing to update");
    }

    //if image is provided, upload to cloudinary
    const imageLink = image ? await uploadOnCloudinary(image) : null;

    //if image is not uploaded, return error
    if(image && !imageLink){
        throw new ApiError(500, "Error uploading image")
    }

    //if image is uploaded, delete old image from cloudinary
    if(imageLink && tweet.image){
        const imageId = tweet.image.split("/").pop().split(".")[0];
        await deleteFromCloudinary(imageId);
    }

    //update tweet
    tweet.content = content || tweet.content;
    tweet.image = imageLink ? imageLink.url : tweet.image;
    await tweet.save();

    //return success response
    res.status(200).json(new ApiResponse(200, {tweet}, "Tweet updated successfully"));
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    //get tweetId from req.params
    const { tweetId } = req.params;

    //check if tweetId is valid
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id"); //return error if tweetId is invalid
    }

    //find tweet by id
    const tweet = await Tweet.findById(tweetId);

    //check if tweet is found
    if(!tweet){
        throw new ApiError(404, "Tweet not found")
    }

    //check if user is authorized to delete tweet
    if(req.user._id.toString() !== tweet.owner.toString()){
        throw new ApiError(401, "Unauthorized")
    }

    //delete tweet image from cloudinary
    if(tweet.image){
        const imageId = tweet.image.split("/").pop().split(".")[0];
        await deleteFromCloudinary(imageId);
    }

    //delete tweet from database
    await tweet.deleteOne();

    //return success response
    res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"));
})

export { createTweet, getUserTweets, updateTweet, deleteTweet };