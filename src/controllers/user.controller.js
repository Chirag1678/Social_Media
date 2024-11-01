import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 

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

export {registerUser, loginUser, logoutUser};