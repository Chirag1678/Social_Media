import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReactPlayer from 'react-player'

const Home = () => {
  const [videos, setVideos] = useState([]);
  const video = useSelector((state) => state.video.videos);
  useEffect(() => {
    setVideos(video);
  }, [video]);
  console.log(videos.docs);
  return (
    <>
    {videos.docs && videos.docs.map((video) => (
      <div key={video._id}>
        <h1>{video.title}</h1>
        <p>{video.description}</p>
        {/* <img src={video.thumbnail} alt={video.title} /> */}
        {/* <video width="750" height="500" controls >
        <source src={video.videoFile} type="video/mp4"/>
        </video> */}
        <div style={{ position: 'relative', width: '200px', height:'100px'}}>
            <ReactPlayer 
              url={video.videoFile} 
              width="100%" 
              height="100%" 
              controls 
              light={video.thumbnail} // Thumbnail as a background
            />
          </div>
      </div>
    ))}
    </>
  )
}

export default Home;
