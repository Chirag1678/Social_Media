import axios from 'axios';
const Backend_api = import.meta.env.VITE_REACT_APP_URL;

const toggleVideoLike = async (videoId) => {
    try {
        const response = await axios.post(`${Backend_api}/likes/toggle/v/${videoId}`, {}, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error liking video:", error);
        throw error;
    }
}

const toggleCommentLike = async (commentId) => {
    try {
        const response = await axios.post(`${Backend_api}/likes/toggle/c/${commentId}`, {}, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error liking comment:", error);
        throw error;
    }
}

const toggleTweetLike = async (tweetId) => {
    try {
        const response = await axios.post(`${Backend_api}/likes/toggle/t/${tweetId}`, {}, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error liking tweet:", error);
        throw error;
    }
}

const getLikedVideos = async () => {
    try {
        const response = await axios.get(`${Backend_api}/likes/videos`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching liked videos:", error);
        throw error;
    }
}

const isLikedVideo = async (videoId) => {
    try {
        const response = await axios.get(`${Backend_api}/likes/v/${videoId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching liked video:", error);
        throw error;
    }
}

const isLikedComment = async (commentId) => {
    try {
        const response = await axios.get(`${Backend_api}/likes/c/${commentId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching liked comment:", error);
        throw error;
    }
}

const isLikedTweet = async (tweetId) => {
    try {
        const response = await axios.get(`${Backend_api}/likes/t/${tweetId}`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching liked tweet:", error);
        throw error;
    }
}

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos, isLikedVideo, isLikedComment, isLikedTweet };