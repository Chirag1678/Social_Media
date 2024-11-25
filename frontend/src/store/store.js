import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import videoReducer from "./videoSlice";
import playlistReducer from "./playlistSlice";
import tweetReducer from "./tweetSlice";

const store=configureStore({
    reducer: {
        auth: authReducer,
        video: videoReducer,
        playlist: playlistReducer,
        tweet: tweetReducer,
    },
});

export default store;