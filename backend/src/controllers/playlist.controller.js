import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPlaylist = asyncHandler(async (req, res) => {
    // get name and description from req.body
    const {name, description} = req.body;


    //check if name is provided
    if(!name){
        throw new ApiError(400, "Name is required");
    }

    // get user id from req.user
    const userId = req.user._id;

    //check if user id is valid
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    // create a new playlist
    const playlist = await Playlist.create({
        name,
        //add description if provided
        ...(description && {description}),
        owner: userId
    });

    //check if playlist is created
    if(!playlist){
        throw new ApiError(500, "Error creating playlist");
    }

    //return success response
    res.status(201).json(new ApiResponse(200, {playlist}, "Playlist created successfully"));

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    // get userId from req.params
    const {userId} = req.params;

    //check if userId is valid
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id");
    }

    // get all playlists of the user
    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            description: 1,
                            videoFile: 1,
                            thumbnail: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                videos: 1,
                owner: 1,
                updatedAt: 1
            }
        }
    ]);

    //return success response
    res.status(200).json(new ApiResponse(200, {playlists}, "User playlists found"));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    // get playlistId from req.params
    const {playlistId} = req.params;

    //check if playlistId is valid
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id");
    }

    // get playlist by id
    // const playlist = await Playlist.findById(playlistId).populate("videos", "title description");
    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $project: {
                            title: 1,
                            description: 1,
                            videoFile: 1,
                            thumbnail: 1,
                            views: 1
                        }
                    }
                ]
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
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                name: 1,
                description: 1,
                videos: 1,
                owner: 1,
                updatedAt: 1,
                public: 1
            }
        }
    ]);

    //check if playlist is found
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    //return success response
    res.status(200).json(new ApiResponse(200, {playlist}, "Playlist found"));
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    //get playlistId and videoId from req.params
    const {playlistId, videoId} = req.params;

    //check if playlistId and videoId are valid
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist id or video id");
    }

    // get playlist by id 
    const playlist = await Playlist.findById(playlistId);

    //check if playlist is found
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    // check if video is already in the playlist
    if(playlist.videos.includes(videoId)){
        throw new ApiError(400, "Video already in playlist");
    }

    // add video to playlist
    playlist.videos.push(videoId);

    // save playlist
    await playlist.save();

    //return success response
    res.status(200).json(new ApiResponse(200, {playlist}, "Video added to playlist"));
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    // get playlistId and videoId from req.params
    const {playlistId, videoId} = req.params;

    //check if playlistId and videoId are valid
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist id or video id");
    }

    // get playlist by id
    const playlist = await Playlist.findById(playlistId);

    //check if playlist is found
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }

    // check if video is in the playlist
    if(!playlist.videos.includes(videoId)){
        throw new ApiError(404, "Video not found in playlist");
    }

    // remove video from playlist
    playlist.videos = playlist.videos.filter(id => id.toString() !== videoId);

    // save playlist
    await playlist.save();

    //return success response
    res.status(200).json(new ApiResponse(200, null, "Video removed from playlist"));
})

const deletePlaylist = asyncHandler(async (req, res) => {
    // get playlistId from req.params
    const {playlistId} = req.params;

    //check if playlistId is valid
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id");
    }

    //check if playlist exists
    const playlist = await Playlist.findById(playlistId);

    //check if playlist is found
    if(!playlist){
        throw new ApiError(404, "Playlist not found");
    }
    
    // delete playlist
    await Playlist.findByIdAndDelete(playlistId);

    //return success response
    res.status(200).json(new ApiResponse(200, null, "Playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
    // get playlistId from req.params
    const {playlistId} = req.params;

    //check if playlistId is valid
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist id");
    }

    // get name and description from req.body
    const {name, description} = req.body;

    // check if name or description is provided
    if(!(name || description)){
        throw new ApiError(400, "Nothing to update");
    }

    // get playlist by id
    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                //update name if provided
                ...(name && {name}),
                //update description if provided
                ...(description && {description})
            },
        },
        {new: true} //return updated playlist
    );

    //check if playlist is updated
    if(!playlist){
        throw new ApiError(500, "Error updating playlist");
    }

    //return success response
    res.status(200).json(new ApiResponse(200, {playlist}, "Playlist updated successfully"));
})

export { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist };