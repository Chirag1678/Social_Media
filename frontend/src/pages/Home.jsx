import { useEffect, useState } from "react";
import VideoCard from "../components/Video/VideoCard";
import { allVideos, deleteVideo } from "../utils/Video";
import { useDispatch, useSelector } from "react-redux";
import { getUserPlaylists } from "../utils/Playlist.js";
import { setPlaylists } from "../store/playlistSlice.js";

const Home = () => {
  const dispatch = useDispatch();
  const [videos, setVideos] = useState([]);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    const getAllVideos = async () => {
      try{
        const response = await allVideos();
        // console.log(response.data);
        setVideos(response.data);
        if(user){
          const playlists = await getUserPlaylists(user.data?._id);
          // console.log(playlists);
          dispatch(setPlaylists(playlists.data));
        }
      }
      catch(error){
        console.error('Error fetching video data:', error);
        throw error;
      }
    }
    getAllVideos();
  }, [user, dispatch]);

  const videoDeletion = async (event,videoId) => {
    try {
        event.stopPropagation();
        const verify = confirm("Are you sure you want to delete");
        if(verify){
            const response = await deleteVideo(videoId);
            setVideos((prev) => prev.docs.filter((vid) => vid._id !== videoId));
            console.log("Video deleted successfully",response);
            alert("Video deleted successfully");
            return true;
        }
        else{
            console.log("Video deletion cancelled");
            return false;
        }
    } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete video. Please try again.");
    }
  }
  // console.log(videos.docs);
  return (
    <div className="w-full max-w-7xl mx-auto md:px-5 px-4 py-10 min-h-screen flex flex-wrap gap-16">
    {videos.docs && videos.docs.map((video) => (
      // <div key={video._id}>
      //   <h1>{video.title}</h1>
      //   <p>{video.description}</p>
      //   {/* <img src={video.thumbnail} alt={video.title} /> */}
      //   {/* <video width="750" height="500" controls >
      //   <source src={video.videoFile} type="video/mp4"/>
      //   </video> */}
      //   <div style={{ position: 'relative', width: '200px', height:'100px'}}>
      //       <ReactPlayer 
      //         url={video.videoFile} 
      //         width="100%" 
      //         height="100%" 
      //         controls 
      //         light={video.thumbnail} // Thumbnail as a background
      //       />
      //     </div>
      // </div>
      <VideoCard key={video._id} video={video} onDelete={event=>videoDeletion(event,video._id)}/>
    ))}
    </div>
  )
}

export default Home;
