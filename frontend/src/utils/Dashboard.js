import axios from "axios";

const channelStats = async (channelId) => {
    try {
        const response = await axios.get(`/api/v1/dashboard/stats/${channelId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching channel stats: ", error);
        throw error;
    }
};

const channelVideos = async (channelId) => {
    try {
        const response = await axios.get(`/api/v1/dashboard/videos/${channelId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching channel videos: ", error);
        throw error;
    }
};

export { channelStats, channelVideos };