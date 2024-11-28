import axios from 'axios';

const toggleSubscribtion = async (channelId) => {
    try {
        const response = await axios.post(`/api/v1/subscriptions/c/${channelId}`);
        return response.data;
    } catch (error) {
        console.error("Error subscribing to channel:", error);
        throw error;
    }
}

const channelSubscribers = async (channelId) => {
    try {
        const response = await axios.get(`/api/v1/subscriptions/c/${channelId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching channel subscribers:", error);
        throw error;
    }
}
export { toggleSubscribtion, channelSubscribers };