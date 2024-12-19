import axios from "axios";
const Backend_api = import.meta.env.VITE_REACT_APP_URL;

const channelStats = async (channelId) => {
    try {
        const response = await axios.get(`${Backend_api}/dashboard/stats/${channelId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching channel stats: ", error);
        throw error;
    }
};

const channelVideos = async (channelId) => {
    try {
        const response = await axios.get(`${Backend_api}/dashboard/videos/${channelId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching channel videos: ", error);
        throw error;
    }
};

export { channelStats, channelVideos };