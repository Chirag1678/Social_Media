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

export { createPlaylist, getUserPlaylists };