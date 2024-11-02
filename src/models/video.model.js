import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // for pagination

const videoSchema = new Schema({
    videoFile:{
        type: String, // cloudinary url
        required: true,
    },
    thumbnail:{
        type: String, // cloudinary url
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    duration:{
        type: Number, // in seconds, auto calculated, through cloudinary
        required: true,
    },
    views:{
        type: Number,
        default: 0,
    },
    isPublished:{
        type: Boolean,
        default: true,
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, 
    {timestamps: true}
);

videoSchema.plugin(mongooseAggregatePaginate); //plugin for pagination, for aggregate queries

export const Video = mongoose.model("Video", videoSchema);