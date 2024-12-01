import { Router } from 'express';
import { createTweet, deleteTweet, getTweetById, getUserTweets, updateTweet } from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

//secured routes
router.route("/").post(upload.single("image"),createTweet); //create a tweet
router.route("/user/:userId").get(getUserTweets); //get user tweets
router.route("/:tweetId").patch(upload.single("image"),updateTweet).delete(deleteTweet).get(getTweetById); //update or delete a tweet

export default router