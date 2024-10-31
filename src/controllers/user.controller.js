import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 

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
    const coverImageLocalPath = req.files?.coverImage[0]?.path; //coverImage is the file uploaded by the user, [0] is used to get the first file from the array
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
    res.status(200).json({
        message: "ok"
    })
});

export {registerUser, loginUser};