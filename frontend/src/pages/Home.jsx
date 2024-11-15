import { useEffect, useState } from "react";
import { useSelector } from "react-redux"

const Home = () => {
  const [videos, setVideos] = useState([]);
  const video = useSelector((state) => state.video.videos);
  useEffect(() => {
    setVideos(video);
  }, [video]);
  console.log(videos.docs[0]);
  return (
    <>
    {videos.docs.map((video) => (
      <div key={video._id}>
        <h1>{video.title}</h1>
        <p>{video.description}</p>
        <img src={video.thumbnail} alt={video.title} />
        {/* <video width="750" height="500" controls >
        <source src={video.videoFile} type="video/mp4"/>
        </video> */}
      </div>
    ))}
    </>
  )
}

export default Home;
