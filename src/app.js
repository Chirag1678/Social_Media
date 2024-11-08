import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({limit:"16kb"})); // for parsing json bodies
app.use(express.urlencoded({extended:true, limit:"16kb"})); // for parsing urlencoded bodies
app.use(express.static("../public")); // for serving static files, "../public" is the path to the public directory
app.use(cookieParser()); // for parsing cookies, it parses the cookies attached to the client request object

//routes import
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import likeRouter from "./routes/like.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter); //makes it http://localhost:8000/api/v1/users/:route
app.use("/api/v1/videos", videoRouter); //makes it http://localhost:8000/api/v1/videos/:route
app.use("/api/v1/subscriptions", subscriptionRouter); //makes it http://localhost:8000/api/v1/subscriptions/:route
app.use("/api/v1/tweets", tweetRouter); //makes it http://localhost:8000/api/v1/tweets/:route
app.use("/api/v1/playlist", playlistRouter); //makes it http://localhost:8000/api/v1/playlist/:route
app.use("/api/v1/likes", likeRouter); //makes it http://localhost:8000/api/v1/likes/:route

export { app };