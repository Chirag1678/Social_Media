import axios from 'axios';
const Backend_api = import.meta.env.VITE_REACT_APP_URL;

const currentUser = async () => {
  try {
    const response = await axios.get(`${Backend_api}/users/current-user`, {
        withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if(error.response.status === 401 && error.response?.data?.message === "Access token has expired"){
        console.error(error);
        try {
            await axios.post(`${Backend_api}/users/refresh-token`, {},{
                withCredentials: true,
            });
            const retryResponse = await axios.get(`${Backend_api}/users/current`, {
                withCredentials: true,
            });
            return retryResponse.data;
        } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            throw new Error('Token refresh failed. Please log in again.');
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
      const response = await axios.post(`${Backend_api}/users/register`, formData, {
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
        const response = await axios.post(`${Backend_api}/users/login`, {
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
        await axios.post(`${Backend_api}/users/logout`, {}, {
            withCredentials: true,
        });
    } catch (error) {
        console.error('Error logging out user:', error);
        throw error;
    }
}

const getUserChannel = async (userName) => {
    try {
        const response = await axios.get(`${Backend_api}/users/c/${userName}`,{
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user channel data:', error);
        throw error;
    }
}

const updateUserAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    try {
        const response = await axios.patch(`${Backend_api}/users/update-avatar`, formData, {
            headers: {
                "Content-Type": 'multipart/form-data'
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error updating user avatar:", error);
        throw error;
    }
}

const updateUserCoverImage = async (file) => {
    const formData = new FormData();
    formData.append('coverImage', file);
    try {
        const response = await axios.patch(`${Backend_api}/users/update-cover-image`, formData, {
            headers: {
                "Content-Type": 'multipart/form-data'
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user cover image:', error);
        throw error;
    }
}

const updateAccountDetails = async (data) => {
    try {
        const response = await axios.patch(`${Backend_api}/users/update-profile`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating account details:", error);
        throw error;
    }
}

const getPassword = async () => {
    try {
        const response = await axios.get(`${Backend_api}/users/get-password`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user password:", error);
        throw error;
    }
}

const updatePassword = async (data) => {
    const formData = new FormData();
    formData.append('currentPassword', data.currentPassword);
    formData.append('newPassword', data.newPassword);
    try {
        const response = await axios.post(`${Backend_api}/users/change-password`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
}

const userWatchHistory = async () => {
    try {
        const response = await axios.get(`${Backend_api}/users/history`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user history: ", error);
        throw error;
    }
}

export { currentUser, logoutUser, loginUser, signUpUser, getUserChannel, updateUserAvatar, updateUserCoverImage, updateAccountDetails, getPassword, updatePassword, userWatchHistory };