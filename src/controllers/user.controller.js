import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        //Find user by id
        const user = await User.findById(userId);
        if(!user) throw new ApiError(404, "User not found");

        //Generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        //Update refresh token in database
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false}); //validateBeforeSave is set to false to avoid validation error while updating the refresh token

        //Return access and refresh tokens
        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Failed to generate access and refresh tokens");
    }
}

const registerUser = asyncHandler(async (req,res) => {
    //testing register user
    // res.status(200).json({
    //     message: "ok"
    // })

    //Steps to register user
    //1. Get user details from frontend
    //2. Validate request body - not empty, format correct
    //3. check if user already exists
    //4. check for images and avatar
    //5. upload files to cloudinary, avatar upload check
    //6. create user object and save to database
    //7. check if user is created successfully
    //8. create and assign a token
    //9. remove password and refresh token field from response
    //10. check for user creation failure
    //11. send response to frontend

    //Writing logic
    //1. get user details from frontend
    const {fullName, email, username, password} = req.body;
    //2. Validate request body
    if([fullName, email, username, password].some((field) => field?.trim() === "")){ //some is used to check if any of the fields are empty
        throw new ApiError(400, "All fields are required");
    }
    //3. check if user already exists
    const existingUser = await User.findOne({
        $or: [{email}, {username}]
    }); //$or is used to check if the email or username already exists
    if(existingUser) throw new ApiError(409, "User already exists");

    //4. check for images and avatar
    const avatarLocalPath = req.files?.avatar[0]?.path; //avatar is the file uploaded by the user, [0] is used to get the first file from the array
    let coverImageLocalPath;
    if(req.files && req.files.coverImage){
        coverImageLocalPath = req.files.coverImage[0]?.path; //coverImage is the file uploaded by the user, [0] is used to get the first file from the array
    }
    if(!avatarLocalPath) throw new ApiError(400, "Avatar is required");

    //5. upload files to cloudinary, avatar upload check
    const avatar = await uploadOnCloudinary(avatarLocalPath); //avatar is the file uploaded by the user
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null; //coverImage is the file uploaded by the user, if coverImageLocalPath is not null, then upload it to cloudinary, otherwise set it to null

    if(!avatar) throw new ApiError(500, "Failed to upload avatar");
    if(coverImageLocalPath && !coverImage) throw new ApiError(500, "Failed to upload cover image"); //if coverImageLocalPath is not null and coverImage is not uploaded, then throw an error

    //6. create user object and save to database
    const user = await User.create({
        fullName, 
        email: email.toLowerCase(), 
        username: username.toLowerCase(), 
        password, 
        avatar: avatar.url, 
        coverImage: coverImage?.url || ""
    });

    //7. check if user is created successfully
    const createdUser = await User.findById(user._id).select("-password -refreshToken"); //select is used to select the fields to be returned, -password is used to not return the password field, -refreshToken is used to not return the refreshToken field
    if(!createdUser) throw new ApiError(500, "Something went wrong while registering the user");

    //8,9,10 is done in ApiResponse
    //11. send response to frontend
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
});

const loginUser = asyncHandler(async (req,res) => {
    //Steps to login user
    //1. get email and password from frontend
    //2. validate request body
    //3. check if user exists{email based or username based} 
    //4. check if password is correct
    //5. create and assign a token (access token and refresh token)
    //6. send cookie to frontend
    //7. send response to frontend

    //Writing logic
    //1. get email, username and password from frontend
    const { email, username, password } = req.body;

    //2. validate request body
    if(!(email || username)) throw new ApiError(400, "Either email or username is required"); //if email or username is not provided, throw an error
    if(!password) throw new ApiError(400, "Password is required"); //if password is not provided, throw an error

    //3. check if user exists{email based or username based} and password is correct
    const user = await User.findOne({ //findOne is used to find the first user that matches the condition
        $or: [{email}, {username}] //$or is used to check if the email or username already exists
    });
    if(!user) throw new ApiError(404, "User does not exist");

    //4. check if password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

    //5. create and assign a token (access token and refresh token)
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    //6-7. send cookie to frontend & send response to frontend
    const cookieOptions={
        httpOnly: true, //httpOnly is used to prevent client side script from accessing the cookie
        secure: true, //secure is used to send the cookie over HTTPS
    }
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken"); //select is used to select the fields to be returned, -password is used to not return the password field, -refreshToken is used to not return the refreshToken field
    
    res.status(200)
    .cookie("accessToken", accessToken, cookieOptions) //cookie is sent to frontend with the name accessToken
    .cookie("refreshToken", refreshToken, cookieOptions) //cookie is sent to frontend with the name refreshToken
    .json(new ApiResponse(200, {user: loggedInUser, accessToken, refreshToken}, "User logged in successfully")); //response is sent to frontend
});

const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.user._id, 
        {
            $set: {
                refreshToken: undefined //refresh token is set to undefined
            }
        }, 
        {new: true} //new is used to return the updated user
    );

    const cookieOptions={
        httpOnly: true, //httpOnly is used to prevent client side script from accessing the cookie
        secure: true, //secure is used to send the cookie over HTTPS
    }

    res.status(200)
    .clearCookie("accessToken", cookieOptions) //cookie is cleared from frontend with the name accessToken
    .clearCookie("refreshToken", cookieOptions) //cookie is cleared from frontend with the name refreshToken
    .json(new ApiResponse(200, {}, "User logged out successfully")); //response is sent to frontend
});

const refreshAccessToken = asyncHandler(async (req,res) => {
    // Get the refresh token from cookies or request body
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    // If no refresh token is provided, throw an unauthorized error
    if(!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

    try {
        // Verify the refresh token
        const decoded = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
        // Find the user associated with the decoded token
        const user = await User.findById(decoded?._id);
    
        // If no user is found, throw an invalid token error
        if(!user) throw new ApiError(401, "Invalid refresh token ");
    
        // If the incoming refresh token doesn't match the user's stored refresh token, throw an error
        if(incomingRefreshToken !== user?.refreshToken) throw new ApiError(401, "Refresh token is expired or used");
    
        // Set cookie options for security
        const cookieOptions={
            httpOnly: true, // Prevents client-side scripts from accessing the cookie
            secure: true, // Ensures the cookie is only sent over HTTPS
        }
    
        // Generate new access and refresh tokens
        const {accessToken,newRefreshToken}=await generateAccessAndRefreshTokens(user._id);
    
        // Send the response with new tokens in cookies and JSON body
        res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", newRefreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed successfully"
            )
        )
    } catch (error) {
        // If any error occurs during the process, throw an invalid token error
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
});

const changeCurrentPassword = asyncHandler(async (req,res) => {
    const {currentPassword, newPassword} = req.body; //get current password and new password from frontend

    //check if current password and new password are provided
    if(!currentPassword || !newPassword) throw new ApiError(400, "Current password and new password are required");

    //find user by id and check if the password is correct
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword); //check if the current password is correct

    //if password is not correct, throw an error
    if(!isPasswordCorrect) throw new ApiError(401, "Invalid current password");

    //if password is correct, update the password
    user.password = newPassword;
    await user.save({validateBeforeSave:false}); //save the updated user, bcrypt will hash the password before saving, validateBeforeSave is set to false to avoid validation error while updating the password

    //send response to frontend
    res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentuser = asyncHandler(async (req,res) => {
    res.status(200).json(new ApiResponse(200, req.user, "User found successfully")); //send response to frontend
});

const updateAccountDetails = asyncHandler(async (req,res) => {
    const {fullName, email, username}=req.body; //get user details from frontend

    //if user details are not provided, throw an error
    if(!fullName || !email || !username) throw new ApiError(400, "Nothing to update");

    //check if username or email already exists
    const existing = await User.findOne({
        $or: [{email}, {username}],
        _id: {$ne: req.user?._id} //exclude the current user
    });

    //if username or email already exists, throw an error
    if(existing) throw new ApiError(409, "Username or email already exists");

    //find user by id and update the details
    const user = await User.findByIdAndUpdate(
        req.user?._id, //find user by id
        {fullName, email, username}, //update the user details
        {new: true} //return the updated user
    ).select("-password -refreshToken"); //select is used to select the fields to be returned, -password is used to not return the password field, -refreshToken is used to not return the refreshToken field

    //send response to frontend
    res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req,res) => {
    const avatarLocalPath = req.file?.path; //get the avatar file uploaded by the user

    //if avatar file is not provided, throw an error
    if(!avatarLocalPath) throw new ApiError(400, "Avatar is required");

    //upload the avatar file to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    //if avatar file is not uploaded, throw an error
    if(!avatar.url) throw new ApiError(500, "Failed to upload avatar");

    //delete the old file from cloudinary
    if(req.user?.avatar) {
        const oldAvatarPublicId = req.user.avatar.split('/').pop().split('.')[0]; // Extract public_id from the avatar URL
        await deleteFromCloudinary(oldAvatarPublicId); // Use the extracted public_id to delete the old avatar
    }
    
    //find user by id and update the avatar
    const user = await User.findByIdAndUpdate(
        req.user?._id, //find user by id
        {
            $set: {avatar: avatar.url} //update the avatar, set is used to update the avatar only
        },
        {new: true} //return the updated user
    ).select("-password -refreshToken"); //select is used to select the fields to be returned, -password is used to not return the password field, -refreshToken is used to not return the refreshToken field

    //send response to frontend 
    res.status(200).json(new ApiResponse(200, user, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req,res) => {
    const coverImageLocalPath = req.file?.path; //get the cover image file uploaded by the user

    //if cover image file is not provided, throw an error
    if(!coverImageLocalPath) throw new ApiError(400, "Cover image is required");

    //upload the cover image file to cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    //if cover image file is not uploaded, throw an error
    if(!coverImage.url) throw new ApiError(500, "Failed to upload cover image");

    //delete the old file from cloudinary
    if(req.user?.coverImage) {
        const oldCoverImageId = req.user.coverImage.split('/').pop().split('.')[0]; // Extract public_id from the cover image URL
        await deleteFromCloudinary(oldCoverImageId); // Use the extracted public_id to delete the old cover image
    }

    //find user by id and update the cover image
    const user = await User.findByIdAndUpdate(
        req.user?._id, //find user by id
        {
            $set: {coverImage: coverImage.url} //update the cover image, set is used to update the cover image only
        },
        {new: true} //return the updated user
    ).select("-password -refreshToken"); //select is used to select the fields to be returned, -password is used to not return the password field, -refreshToken is used to not return the refreshToken field

    //send response to frontend
    res.status(200).json(new ApiResponse(200, user, "Cover image updated successfully"));
});

export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentuser, updateAccountDetails, updateUserAvatar, updateUserCoverImage}; //export the functions to be used in routes