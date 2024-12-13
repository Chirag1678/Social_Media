import { Router } from 'express';
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

//secured routes
router.route("/c/:channelId").post(toggleSubscription).get(getUserChannelSubscribers); //get subscriber list of a channel && toggle subscription
router.route("/subscribed").get(getSubscribedChannels); //get subscribed channels of a user
// router.route("/u/:subscriberId")

export default router;