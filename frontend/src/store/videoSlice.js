import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videos: [],
};

const videoSlice = createSlice({
    name: "video",
    initialState,
    reducers: {
        setVideos: (state, action) => {
            state.videos = action.payload;
        },
        addVideo: (state, action) => {
            state.videos.push(action.payload);
        },
        removeVideo: (state, action) => {
            state.videos = state.videos.filter((video) => video._id !== action.payload);
        },
        updateVideo: (state, action) => {
            state.videos = state.videos.map((video) => (video._id === action.payload._id ? action.payload : video));
        },
    },
});

export const { setVideos, addVideo, removeVideo, updateVideo } = videoSlice.actions;
export default videoSlice.reducer;