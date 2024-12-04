import { useLocation } from "react-router-dom"
import { allVideos } from "../utils/Video";
import { useEffect, useState } from "react";
import { VideoCard } from "../components";

const SearchResult = () => {
  const [videos, setVideos]= useState([]);
  const location = useLocation();
//   console.log(location);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");
//   console.log(query);

  useEffect(()=>{
    const fetchVideos = async () => {
        try {
            const params = {query};
            const response = await allVideos(params);
            // console.log(response);
            setVideos(response.data);
        } catch (error) {
            console.error("Error fetching videos:", error);
            alert("Error fetching videos. Please try again!");
        }
    }
    fetchVideos();
  },[query]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center w-full">
        {videos.docs && videos.docs.map((video)=>(
            <VideoCard key={video._id} video={video}/>
        ))}
        {videos.docs?.length==0 && <div>
            No videos found
        </div>}
    </div>
  )
}

export default SearchResult
