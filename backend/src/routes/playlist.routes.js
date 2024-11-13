import { Router } from 'express';
import { addVideoToPlaylist, createPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeVideoFromPlaylist, updatePlaylist } from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

//secured routes
router.route("/").post(createPlaylist); //create a new playlist
router.route("/:playlistId").get(getPlaylistById).patch(updatePlaylist).delete(deletePlaylist); //get, update or delete a playlist
router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist); //add a video to a playlist
router.route("/remove/:videoId/:playlistId").patch(removeVideoFromPlaylist); //remove a video from a playlist
router.route("/user/:userId").get(getUserPlaylists); //get all playlists of a user

export default router;