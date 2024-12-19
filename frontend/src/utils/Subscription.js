import axios from 'axios';
const Backend_api = import.meta.env.VITE_REACT_APP_URL;

const toggleSubscribtion = async (channelId) => {
    try {
        const response = await axios.post(`${Backend_api}/subscriptions/c/${channelId}`, {}, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error subscribing to channel:", error);
        throw error;
    }
}

const channelSubscribers = async (channelId) => {
    try {
        const response = await axios.get(`${Backend_api}/subscriptions/c/${channelId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching channel subscribers:", error);
        throw error;
    }
}

const getSubscribedChannels = async () => {
    try {
        const response = await axios.get(`${Backend_api}/subscriptions/subscribed`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching subscribed channels:", error);
        throw error;
    }
};

export { toggleSubscribtion, channelSubscribers, getSubscribedChannels };