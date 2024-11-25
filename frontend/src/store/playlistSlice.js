import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    playlists: [],
};

const playlistSlice = createSlice({
    name: "playlist",
    initialState,
    reducers: {
        setPlaylists: (state, action) => {
            state.playlists = action.payload;
        },
        addPlaylist: (state, action) => {
            state.playlists.push(action.payload);
        },
        removePlaylist: (state, action) => {
            state.playlists = state.playlists.filter((playlist) => playlist._id !== action.payload);
        },
        updatePlaylist: (state, action) => {
            state.playlists = state.playlists.map((playlist) => (playlist._id === action.payload._id ? action.payload : playlist));
        },
    },
});

export const { setPlaylists, addPlaylist, removePlaylist, updatePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;