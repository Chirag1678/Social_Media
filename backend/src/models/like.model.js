import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId, // reference to the Video model
        ref: "Video",
    },
    comment: {
        type: Schema.Types.ObjectId, // reference to the Comment model
        ref: "Comment",
    },
    tweet: {
        type: Schema.Types.ObjectId, // reference to the Tweet model
        ref: "Tweet",
    },
    likedBy: {
        type: Schema.Types.ObjectId, // reference to the User model
        ref: "User",
    }
},
    {timestamps: true}
);

export const Like = mongoose.model("Like", likeSchema);