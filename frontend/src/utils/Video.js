import axios from 'axios';

const getVideoById = async (videoId) => {
  try {
    const response = await axios.get(`/api/v1/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video data:', error);
    throw error;
  }
};

export { getVideoById };