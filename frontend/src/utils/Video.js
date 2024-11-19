import axios from 'axios';

const allVideos = async () => {
  try {
    const response = await axios.get('/api/v1/videos');
    return response.data;
  } catch (error) {
    console.error('Error fetching video data:', error);
    throw error;
  }
};

const getVideoById = async (videoId) => {
  try {
    const response = await axios.get(`/api/v1/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video data:', error);
    throw error;
  }
};

export { allVideos, getVideoById };