import axios from 'axios';

const currentUser = async () => {
  try {
    const response = await axios.get('/api/v1/users/current-user', {
        withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if(error.response.status === 401 && error.response?.data?.message === "Access token has expired"){
        console.error(error);
        try {
            await axios.post('/api/v1/users/refresh-token', {},{
                withCredentials: true,
            });
            const retryResponse = await axios.get(`/api/v1/users/current`, {
                withCredentials: true,
            });
            return retryResponse.data;
        } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            throw new Error('Token refresh failed. Please log in again.');;
        }
    }
    console.error('Error fetching user data:', error);
    throw error;
  }
}

const signUpUser = async (data) => {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    formData.append('username', data.username);
    formData.append('password', data.password); 
    if (data.avatar?.length > 0) {
      formData.append('avatar', data.avatar[0]);
    }
    if (data.coverImage?.length > 0) {
      formData.append('coverImage', data.coverImage[0]);
    }   
    try {
      const response = await axios.post('/api/v1/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error signing up user:', error.response?.data || error.message);
      throw error.response?.data?.message || error.message;
    }
};

const loginUser = async (email, password) => {
    try {
        const response = await axios.post('/api/v1/users/login', {
            email,
            password,
        }, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
}

const logoutUser = async () => {
    try {
        await axios.post('/api/v1/users/logout', {}, {
            withCredentials: true,
        });
    } catch (error) {
        console.error('Error logging out user:', error);
        throw error;
    }
}

const getUserChannel = async (userName) => {
    try {
        const response = await axios.get(`/api/v1/users/c/${userName}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user channel data:', error);
        throw error;
    }
}

export { currentUser, logoutUser, loginUser, signUpUser, getUserChannel };