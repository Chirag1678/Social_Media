import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const toggleSubscribtion = async (channelId) => {
    try {
        const response = await axios.post(`${API_URL}/api/v1/subscriptions/c/${channelId}`);
        return response.data;
    } catch (error) {
        console.error("Error subscribing to channel:", error);
        throw error;
    }
}

const channelSubscribers = async (channelId) => {
    try {
        const response = await axios.get(`${API_URL}/api/v1/subscriptions/c/${channelId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching channel subscribers:", error);
        throw error;
    }
}

const getSubscribedChannels = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/v1/subscriptions/subscribed`);
        return response.data;
    } catch (error) {
        console.error("Error fetching subscribed channels:", error);
        throw error;
    }
};

export { toggleSubscribtion, channelSubscribers, getSubscribedChannels };