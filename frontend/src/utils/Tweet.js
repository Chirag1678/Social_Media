import axios from 'axios'; 

const createTweet = async (data) => {
    try {
        const response = await axios.post('/api/v1/tweets', data, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating tweet:', error);
        throw error;
    }
}

const getUserTweets = async (userId) => {
    try {
        const response = await axios.get(`/api/v1/tweets/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tweet data:', error);
        throw error;
    }
}

export { createTweet, getUserTweets };