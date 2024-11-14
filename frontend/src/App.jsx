import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { login, logout } from './store/authSlice';
import { Outlet } from 'react-router-dom';
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch=useDispatch();
  useEffect(() => {
    axios.get("/api/v1/users/current-user",{
      withCredentials: true,
    })
    .then((response)=>{
      console.log(response.status);
      if(response.data){
        console.log(response.data);
        dispatch(login(response.data));
      }
      else{
        dispatch(logout());
      }
    })
    .catch(()=>{
      setError("Failed to fetch user. Please try again."); // Set error message on API failure
      dispatch(logout());
    })
    .finally(()=>{
      setLoading(false);
    });
  },[dispatch],[document.cookie]);
  if(loading) return null;
  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-screen bg-black text-white">
        <div className="error-message">
          {error}
        </div> {/* You can style this error message as needed */}
      </div>
    );
  }
  return (
    <div className="bg-black w-full h-screen text-white">
      <Outlet />
    </div>
  )
}

export default App