import { Router } from 'express';
import { getLikedVideos, toggleCommentLike, toggleVideoLike, toggleTweetLike, isLikedVideo, isLikedComment, isLikedTweet } from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

//secured routes
router.route("/toggle/v/:videoId").post(toggleVideoLike); //toggle like on video
router.route("/toggle/c/:commentId").post(toggleCommentLike); //toggle like on comment
router.route("/toggle/t/:tweetId").post(toggleTweetLike); //toggle like on tweet
router.route("/videos").get(getLikedVideos); //get all liked videos
router.route("/v/:videoId").get(isLikedVideo); //check if video is liked
router.route("/c/:commentId").get(isLikedComment); //check if comment is liked
router.route("/t/:tweetId").get(isLikedTweet); //check if tweet is liked

export default router