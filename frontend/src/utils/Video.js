import axios from 'axios';

const allVideos = async (params) => {
  try {
    let url = '/api/v1/videos';  // Default URL
    if (params) {
      const { query, page = 1, limit = 10, sortBy, sortType, userId } = params;
      
      // Construct query string for all available params
      const queryParams = new URLSearchParams();
      if (query) queryParams.append('query', query);
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (sortType) queryParams.append('sortType', sortType);
      if (userId) queryParams.append('userId', userId);
      
      // Attach the query parameters to the URL
      url = `/api/v1/videos?${queryParams.toString()}`;
    }

    // Send the request with or without query parameters
    const response = await axios.get(url);
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