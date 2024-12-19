import axios from 'axios';
const Backend_api = import.meta.env.VITE_REACT_APP_URL;

const getCommentsById = async (videoId) => {
  try {
    const response = await axios.get(`${Backend_api}/comments/${videoId}`,{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching video data:', error);
    throw error;
  }
};

const getTweetCommentsById = async (tweetId) => {
  try {
    const response = await axios.get(`${Backend_api}/comments/t/${tweetId}`,{
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tweet data:', error);
    throw error;
  }
};

const createComment = async (videoId, data) => {
  try {
    const response = await axios.post(`${Backend_api}/comments/${videoId}`, {
      content: data.content,
    }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

const createTweetComment = async (tweetId, data) => {
  try {
    const response = await axios.post(`${Backend_api}/comments/t/${tweetId}`, {
      content: data.content,
    }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${Backend_api}/comments/c/${commentId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

const updateComment = async (commentId, content) => {
  try {
    const response = await axios.patch(`${Backend_api}/comments/c/${commentId}`, {
      content: content.content,
    }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export { getCommentsById, createComment, deleteComment, updateComment, getTweetCommentsById, createTweetComment };