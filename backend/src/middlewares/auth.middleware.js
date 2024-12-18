import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", ""); //access token is extracted from the cookies or the header, replace is used to remove the Bearer prefix
        if(!token) throw new ApiError(401, "User is not logged in"); //if token is not found, throw an error
    
        //verify the token and find the user from the database
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select("-password -refreshToken"); //user is found by id and the password and refreshToken fields are not returned
    
        //check if user exists
        if(!user) throw new ApiError(401, "Invalid access token ");
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            // Specific handling for expired token
            return next(new ApiError(401, "Access token has expired"));
        }
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});