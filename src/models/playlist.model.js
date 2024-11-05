import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    videos: [{
        type: Schema.Types.ObjectId, // reference to the Video model
        ref: "Video",
    }],
    owner: {
        type: Schema.Types.ObjectId, // reference to the User model
        ref: "User",
    },
    public: {
        type: Boolean, // whether the playlist is public or private
        default: true,
    }
},
    {timestamps: true}
);

export const Playlist = mongoose.model("Playlist", playlistSchema);