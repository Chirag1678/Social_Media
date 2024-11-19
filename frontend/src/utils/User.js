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
export { currentUser, logoutUser };