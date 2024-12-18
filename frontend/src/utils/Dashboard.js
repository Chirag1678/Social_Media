import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const channelStats = async (channelId) => {
    try {
        const response = await axios.get(`${API_URL}/api/v1/dashboard/stats/${channelId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching channel stats: ", error);
        throw error;
    }
};

const channelVideos = async (channelId) => {
    try {
        const response = await axios.get(`${API_URL}/api/v1/dashboard/videos/${channelId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching channel videos: ", error);
        throw error;
    }
};

export { channelStats, channelVideos };