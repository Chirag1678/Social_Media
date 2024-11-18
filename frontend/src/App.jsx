import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice';
import { setVideos } from './store/videoSlice';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Header } from './components';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch=useDispatch();
  const navigate = useNavigate();
  useEffect(() =>{
    axios.get("/api/v1/users/current-user",{
      withCredentials: true,
    })
    .then((response)=>{
      // console.log(response.status);
      if(response.data){
        // console.log(response.data);
        dispatch(login(response.data));
        axios.get("/api/v1/videos")
        .then((response)=>{
          // dispatch(setVideos(response.data));
          // console.log(response.data.data);
          dispatch(setVideos(response.data.data));
        })
        .catch(()=>{
          setError("Failed to fetch videos. Please try again."); // Set error message on API failure
        });
      }
      else{
        dispatch(logout());
        navigate("/login");
      }
    })
    .catch(()=>{
      setError("Failed to fetch user. Please try again."); // Set error message on API failure
      dispatch(logout());
      navigate("/login");
    })
    .finally(()=>{
      setLoading(false);
    });
  },[dispatch, navigate],[document.cookie]);
  if(loading) return null;
  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center w-full h-screen bg-black text-white">
  //       <div className="error-message">
  //         {error}
  //       </div> {/* You can style this error message as needed */}
  //     </div>
  //   );
  // }
  return (
    <div className="bg-black w-full text-white">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App