import axios from 'axios'; 

const createTweet = async (data) => {
    try {
        const formData = new FormData();
        formData.append('content', data.content);
        if(data.image) {
            formData.append('image', data.image[0]);
        }
        const response = await axios.post('/api/v1/tweets', formData, {
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
        const response = await axios.get(`/api/v1/tweets/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tweet data:', error);
        throw error;
    }
}

export { createTweet, getUserTweets };