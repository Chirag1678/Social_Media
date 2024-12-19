import axios from 'axios';
const Backend_api = import.meta.env.VITE_REACT_APP_URL;

const createPlaylist = async (title, description) => {
    try {
        const response = await axios.post(`${Backend_api}/playlist`, {
            name: title,
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

const deletePlaylist = async (playlistId) => {
    try {
        const response = await axios.delete(`${Backend_api}/playlist/${playlistId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting playlist:', error);
        throw error;
    }
};

const updatePlaylist = async (playlistId, data) => {
    const formData = new FormData();
    if (data.name) {
        formData.append('name', data.name);
    }
    if (data.description) {
        formData.append('description', data.description);
    }
    try {
        const response = await axios.patch(`${Backend_api}/playlist/${playlistId}`, formData, {
            headers: {
                "Content-Type": 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating playlist:', error);
        throw error;
    }
};

const getUserPlaylists = async (userId) => {
    try {
        const response = await axios.get(`${Backend_api}/playlist/user/${userId}`,{
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching playlist data:', error);
        throw error;
    }
}

const getPlaylistById = async (playlistId) => {
    try {
        const response = await axios.get(`${Backend_api}/playlist/${playlistId}`,{
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching playlist data:', error);
        throw error;
    }
}

const addVideoToPlaylist = async (playlistId, videoId) => {
    try {
        const response = await axios.patch(`${Backend_api}/playlist/add/${videoId}/${playlistId}`, {}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error adding video to playlist:', error);
        throw error;
    }
}

const removeVideoFromPlaylist = async (playlistId, videoId) => {
    try {
        const response = await axios.patch(`${Backend_api}/playlist/remove/${videoId}/${playlistId}`, {}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error removing video from playlist:', error);
        throw error;
    }
}

export { createPlaylist, deletePlaylist, updatePlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist };