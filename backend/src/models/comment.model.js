import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"; // for pagination

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    video: {
        type: Schema.Types.ObjectId, // reference to the Video model
        ref: "Video",
    },
    tweet: {
        type: Schema.Types.ObjectId, // reference to the Tweet model
        ref: "Tweet",
    },
    owner: {
        type: Schema.Types.ObjectId, // reference to the User model
        ref: "User",
    },
},
    {timestamps: true}
);

commentSchema.plugin(mongooseAggregatePaginate); //plugin for pagination, for aggregate queries

export const Comment = mongoose.model("Comment", commentSchema);