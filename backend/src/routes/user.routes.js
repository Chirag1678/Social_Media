import { Router} from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentuser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannel, getWatchHistory, getPassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//public routes
router.route("/register").post(
    upload.fields([
        {
            name: "avatar", 
            maxCount: 1
        }, 
        {
            name: "coverImage", 
            maxCount: 1
        }
    ]), 
    registerUser
); //upload.fields is used to upload multiple files
router.route("/login").post(loginUser); //login user

//secure routes
router.route("/logout").post(verifyJWT, logoutUser); //logout user, verifyJWT is used to verify the access token
router.route("/refresh-token").post(refreshAccessToken); //refresh access token when it expires
router.route("/get-password").get(verifyJWT, getPassword); //get current user's password
router.route("/change-password").post(verifyJWT, changeCurrentPassword); //change password, verifyJWT is used to verify the access token
router.route("/current-user").get(verifyJWT, getCurrentuser); //get current user, verifyJWT is used to verify the access token
router.route("/update-profile").patch(verifyJWT, updateAccountDetails); //update account details, verifyJWT is used to verify the access token
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar); //update avatar, verifyJWT is used to verify the access token
router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage); //update cover image, verifyJWT is used to verify the access token
router.route("/c/:username").get(verifyJWT, getUserChannel); //get current user channel, verifyJWT is used to verify the access token
router.route("/history").get(verifyJWT, getWatchHistory); //get watch history, verifyJWT is used to verify the access token
export default router;