import { useEffect, useState } from "react";
import VideoCard from "../components/Video/VideoCard";
import { allVideos, deleteVideo, updateVideo } from "../utils/Video";
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
        const filteredVideos = response.data.docs.filter((video)=> video.isPublished===true);
        setVideos(filteredVideos);
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
            setVideos((prev) => prev.filter((vid) => vid._id !== videoId));
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

  const videoUpdation = async (data,videoId) => {
    try {
        // console.log(`${data.title},${videoId}`);
        const response = await updateVideo(data,videoId);
        console.log("Video updated successfully",response);

        // Update the filteredVideos state
        setVideos((prevVideos) =>
            prevVideos.map((video) =>
              video._id === videoId
                ? {
                    ...video,
                    title: data.title || video.title,
                    description: data.description || video.description,
                    thumbnail: response.data?.thumbnail || video.thumbnail,
                  }
                : video
            )
        );
        alert("Video updated successfully");
    } catch (error) {
        console.error("Error updating video:", error);
        alert("Failed to update video. Please try again.");
    }
  }
  // console.log(videos.docs);
  return (
    <div className="w-full mx-auto px-12 py-10 min-h-screen flex flex-wrap justify-between">
    {videos && videos.map((video) => (
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
      <VideoCard key={video._id} video={video} onDelete={event=>videoDeletion(event,video._id)} onUpdate={videoUpdation}/>
    ))}
    </div>
  )
}

export default Home;
