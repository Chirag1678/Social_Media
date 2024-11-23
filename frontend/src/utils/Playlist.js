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

export { createPlaylist };