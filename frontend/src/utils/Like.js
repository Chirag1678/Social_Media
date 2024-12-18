import axios from 'axios';

const toggleVideoLike = async (videoId) => {
    try {
        const response = await axios.post(`/api/v1/likes/toggle/v/${videoId}`);
        return response.data;
    } catch (error) {
        console.error("Error liking video:", error);
        throw error;
    }
}

const toggleCommentLike = async (commentId) => {
    try {
        const response = await axios.post(`/api/v1/likes/toggle/c/${commentId}`);
        return response.data;
    } catch (error) {
        console.error("Error liking comment:", error);
        throw error;
    }
}

const toggleTweetLike = async (tweetId) => {
    try {
        const response = await axios.post(`/api/v1/likes/toggle/t/${tweetId}`);
        return response.data;
    } catch (error) {
        console.error("Error liking tweet:", error);
        throw error;
    }
}

const getLikedVideos = async () => {
    try {
        const response = await axios.get(`/api/v1/likes/videos`);
        return response.data;
    } catch (error) {
        console.error("Error fetching liked videos:", error);
        throw error;
    }
}

const isLikedVideo = async (videoId) => {
    try {
        const response = await axios.get(`/api/v1/likes/v/${videoId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching liked video:", error);
        throw error;
    }
}

const isLikedComment = async (commentId) => {
    try {
        const response = await axios.get(`/api/v1/likes/c/${commentId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching liked comment:", error);
        throw error;
    }
}

const isLikedTweet = async (tweetId) => {
    try {
        const response = await axios.get(`/api/v1/likes/t/${tweetId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching liked tweet:", error);
        throw error;
    }
}

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos, isLikedVideo, isLikedComment, isLikedTweet };