import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tweets: [],
};

const tweetSlice = createSlice({
    name: "tweet",
    initialState,
    reducers: {
        setTweets: (state, action) => {
            state.tweets = action.payload;
        },
        addTweet: (state, action) => {
            state.tweets.push(action.payload);
        },
        removeTweet: (state, action) => {
            state.tweets = state.tweets.filter((tweet) => tweet._id !== action.payload);
        },
        updateTweet: (state, action) => {
            state.tweets = state.tweets.map((tweet) => (tweet._id === action.payload._id ? action.payload : tweet));
        },
    },
});

export const { setTweets, addTweet, removeTweet, updateTweet } = tweetSlice.actions;
export default tweetSlice.reducer;