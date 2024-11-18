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

export { getCommentsById };