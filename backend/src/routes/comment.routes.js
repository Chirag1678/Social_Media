import { Router } from 'express';
import { addComment, addTweetComment, deleteComment, getTweetComments, getVideoComments, updateComment } from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

//secured routes
router.route("/:videoId").get(getVideoComments).post(addComment); //get all comments for a video, add a comment to a video
router.route("/t/:tweetId").get(getTweetComments).post(addTweetComment); //get all comments for a tweet, add a comment to a tweet
router.route("/c/:commentId").delete(deleteComment).patch(updateComment); //delete a comment, update a comment

export default router