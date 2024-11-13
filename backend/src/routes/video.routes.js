import { Router} from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJWT); //verifyJWT is used to verify the access token

//secured routes
router.route("/").get(getAllVideos).post(
    upload.fields([
        {
            name: "videoFile", 
            maxCount: 1
        }, 
        {
            name: "thumbnail", 
            maxCount: 1
        }
    ]),
    publishAVideo
); //upload video and thumbnail, publish a video
router.route("/:videoId").get(getVideoById).delete(deleteVideo).patch(
    upload.single("thumbnail"), 
    updateVideo
); //update video details like title, description, thumbnail
router.route("/toggle/publish-status/:videoId").patch(togglePublishStatus); //toggle publish status
export default router;