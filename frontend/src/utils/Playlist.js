import axios from 'axios';
const createPlaylist = async (title,description) => {
    try {
        const response = await axios.post('/api/v1/playlist', {
            name:title,
            description,
        }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating playlist:', error);
        throw error;
    }
}

const getUserPlaylists = async (userId) => {
    try {
        const response = await axios.get(`/api/v1/playlist/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching playlist data:', error);
        throw error;
    }
}

const getPlaylistById = async (playlistId) => {
    try {
        const response = await axios.get(`/api/v1/playlist/${playlistId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching playlist data:', error);
        throw error;
    }
}

const addVideoToPlaylist = async (playlistId,videoId) => {
    try {
        const response = await axios.patch(`/api/v1/playlist/add/${videoId}/${playlistId}`, {
        }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error adding video to playlist:', error);
        throw error;
    }
}

const removeVideoFromPlaylist = async (playlistId,videoId) => {
    try {
        const response = await axios.patch(`/api/v1/playlist/remove/${videoId}/${playlistId}`, {
        }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error removing video from playlist:', error);
        throw error;
    }
}

export { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist };