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

const createVideo = async (data) => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('videoFile', data.videoFile[0]);
    formData.append('thumbnail', data.thumbnail[0]);
    const response = await axios.post('/api/v1/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
}

export { allVideos, getVideoById, createVideo };