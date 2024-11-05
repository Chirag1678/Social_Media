import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId, // reference to the User model
        ref: "User"
    }
},
    {timestamps: true}
);

export const Tweet = mongoose.model("Tweet", tweetSchema);