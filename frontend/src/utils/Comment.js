import axios from 'axios';

const getCommentsById = async (videoId) => {
  try {
    const response = await axios.get(`/api/v1/comments/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video data:', error);
    throw error;
  }
};

const getTweetCommentsById = async (tweetId) => {
  try {
    const response = await axios.get(`/api/v1/comments/t/${tweetId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tweet data:', error);
    throw error;
  }
};

const createComment = async (videoId,data) => {
  try {
    const response = await axios.post(`/api/v1/comments/${videoId}`, {
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

const createTweetComment = async (tweetId,data) => {
  try {
    const response = await axios.post(`/api/v1/comments/t/${tweetId}`, {
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
    const response = await axios.delete(`/api/v1/comments/c/${commentId}`, {
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
    const response = await axios.patch(`/api/v1/comments/c/${commentId}`, {
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