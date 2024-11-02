import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true, // for faster search, it creates a search index on the username field
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar:{
        type: String, // cloudinary url
        required: true,
    },
    coverImage:{
        type: String, // cloudinary url
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video",
        }
    ],
    password:{
        type: String, // hashed password
        required: [true, "Password is required"], //custom error message
    },
    refreshToken: {
        type: String,
    },
}, 
    {timestamps: true}
);

userSchema.pre("save", async function(next){ // middleware to hash the password before saving
    if(!this.isModified("password")){ // if password is not modified, then move to next middleware
        return next();
    } 
    this.password = await bcrypt.hash(this.password, 10); // hashing the password, using 10 salt rounds
    next(); // move to next middleware
});

// method to compare the password
userSchema.methods.isPasswordCorrect = async function(password){ 
    return await bcrypt.compare(password, this.password); // compare the password with the hashed password
}

// methods to generate jwt token
userSchema.methods.generateAccessToken = function(){ // method to generate access token
    return jwt.sign(
        { // payload
            _id: this._id, 
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET, // secret key
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // expiry time
        }
    ); // sign the token with the secret key and expiry time
}

userSchema.methods.generateRefreshToken = function(){ // method to generate refresh token
    return jwt.sign(
        { // payload
            _id: this._id,
        }, 
        process.env.REFRESH_TOKEN_SECRET, // secret key
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // expiry time
        }
    ); // sign the token with the secret key and expiry time
}

export const User = mongoose.model("User", userSchema);