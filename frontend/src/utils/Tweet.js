import axios from 'axios';
const Backend_api = import.meta.env.VITE_REACT_APP_URL;

const createTweet = async (data) => {
    try {
        const formData = new FormData();
        formData.append('content', data.content);
        if(data.image) {
            formData.append('image', data.image[0]);
        }
        const response = await axios.post(`${Backend_api}/tweets`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data', // Indicate the content type for file uploads
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating tweet:', error);
        throw error;
    }
}

const getUserTweets = async (userId) => {
    try {
        const response = await axios.get(`${Backend_api}/tweets/user/${userId}`,{
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tweet data:', error);
        throw error;
    }
}

const getTweetById = async (tweetId) => {
    try {
        const response = await axios.get(`${Backend_api}/tweets/${tweetId}`,{
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tweet data:', error);
        throw error;
    }
}

const deleteTweet = async (tweetId) => {
    try {
        const response = await axios.delete(`${Backend_api}/tweets/${tweetId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting tweet:', error);
        throw error;
    }
}

const updateTweet = async (data,tweetId) => {
    try {
        const formData = new FormData();
        if(data.content){
            formData.append('content', data.content);
        }
        if(data.image && data.image.length > 0){
            formData.append('image', data.image[0]);
        }
        const response = await axios.patch(`${Backend_api}/tweets/${tweetId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error updating tweet:", error);
        throw error;
    }
}

export { createTweet, getUserTweets, getTweetById, deleteTweet, updateTweet };