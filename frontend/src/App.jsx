import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice';
import { useNavigate } from 'react-router-dom';
import { Container, Header } from './components';
import { currentUser } from './utils/User.js';

function App() {
  const [error, setError] = useState(null);
  const dispatch=useDispatch();
  const navigate = useNavigate();
  useEffect(() =>{
    // axios.get("/api/v1/users/current-user",{
    //   withCredentials: true,
    // })
    // .then((response)=>{
    //   // console.log(response.status);
    //   if(response.data){
    //     // console.log(response.data);
    //     dispatch(login(response.data));
    //     axios.get("/api/v1/videos")
    //     .then((response)=>{
    //       // dispatch(setVideos(response.data));
    //       // console.log(response.data.data);
    //       dispatch(setVideos(response.data.data));
    //     })
    //     .catch(()=>{
    //       setError("Failed to fetch videos. Please try again."); // Set error message on API failure
    //     });
    //   }
    //   else{
    //     dispatch(logout());
    //     navigate("/login");
    //   }
    // })
    // .catch(()=>{
    //   setError("Failed to fetch user. Please try again."); // Set error message on API failure
    //   dispatch(logout());
    //   navigate("/login");
    // })
    const fetchUser = async () => {
      try {
        const user = await currentUser();
        if (user) {
          dispatch(login(user));
        }
      } catch (error) {
        if (error.response?.status === 401 || error.response?.data?.message === "User is not logged in") {
          // If user is not logged in, navigate to home or login page
          navigate('/');
        }
        setError("Failed to fetch user. Please try again.", error);
        dispatch(logout());
      }
    }
    fetchUser();
  },[dispatch, navigate]);
  // if(loading) return null;
  return (
    <div className="bg-black w-full text-white ">
      <Container>
      <Header />
      </Container>
    </div>
  )
}

export default App