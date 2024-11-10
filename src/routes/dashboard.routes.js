import { Router } from 'express';
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

//secured routes
router.route("/stats").get(getChannelStats); // Get channel stats like total video views, total subscribers, total videos, total likes etc.
router.route("/videos").get(getChannelVideos); // Get all the videos uploaded by the channel

export default router