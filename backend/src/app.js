import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
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
import commentRouter from "./routes/comment.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import { ApiError } from "./utils/ApiError.js";

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter); //makes it http://localhost:8000/api/v1/healthcheck/:route
app.use("/api/v1/users", userRouter); //makes it http://localhost:8000/api/v1/users/:route
app.use("/api/v1/videos", videoRouter); //makes it http://localhost:8000/api/v1/videos/:route
app.use("/api/v1/subscriptions", subscriptionRouter); //makes it http://localhost:8000/api/v1/subscriptions/:route
app.use("/api/v1/tweets", tweetRouter); //makes it http://localhost:8000/api/v1/tweets/:route
app.use("/api/v1/playlist", playlistRouter); //makes it http://localhost:8000/api/v1/playlist/:route
app.use("/api/v1/likes", likeRouter); //makes it http://localhost:8000/api/v1/likes/:route
app.use("/api/v1/comments", commentRouter); //makes it http://localhost:8000/api/v1/comments/:route
app.use("/api/v1/dashboard", dashboardRouter); //makes it http://localhost:8000/api/v1/dashboard/:route

app.use((err, req, res, next) => {
  console.error(err); // Log error for debugging
  if (err instanceof ApiError) {
    // If it's a custom API error, use the statusCode from the error
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || [], // Optional: Include additional error details
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Include stack trace in dev environment
    });
  }

  // For other unexpected errors, use 500 status code by default
  return res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Optional: include stack trace in development
  });
});
  
export { app };