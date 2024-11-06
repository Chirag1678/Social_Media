import { Router } from 'express';
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

//secured routes
router.route("/c/:channelId").get(getSubscribedChannels).post(toggleSubscription); //toggle subscription
router.route("/u/:subscriberId").get(getUserChannelSubscribers); //get subscriber list of a channel

export default router;