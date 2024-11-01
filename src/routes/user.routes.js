import { Router} from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
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

export default router;