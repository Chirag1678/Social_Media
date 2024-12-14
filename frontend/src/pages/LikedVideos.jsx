import { useEffect, useState } from "react";
import { getLikedVideos } from "../utils/Like";
import { useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);

  const navigate = useNavigate();
  const owner = useSelector(state => state.auth.user)?.data;
  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await getLikedVideos();
        console.log("Liked videos fetched:", response);
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching liked videos: ", error);
        alert("Error fetching liked videos, please try again");
      }
    };
    fetchLikedVideos();
  }, []);

  const handleCardClick = (video) => {
    navigate(`/video/${video._id}`);
  };
  return (
    <>
    <div className="pl-5 mt-2 bg-black min-h-screen flex justify-between">
      <div className="h-[88vh] w-[28vw] rounded-t-2xl bg-gradient-to-b from-green-900/75 to-black p-5">
        <div className="w-full h-[25vh] rounded-xl overflow-hidden bg-white flex items-center justify-center">
          {videos?.length>0 && <img src={videos[0].thumbnail} alt="Liked videos" className="w-full h-full"/>}
          {videos?.length===0 && <img src="data:image/png;base64,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" alt="Liked videos" className='h-2/3'/>}
        </div>
        <div className="w-full mt-8">
        <h1 className="font-semibold text-white mt-2">Liked videos</h1>
        <p className="mt-4">{owner?.fullName}</p>
        <div className="flex items-center justify-between text-sm">
            <p>{videos.length} videos</p>
            <p>No views</p>
            <p>Last updated on Dec 2, 2024</p>
            <button><BsThreeDotsVertical className="text-lg"/></button>
        </div>
        <div className="flex items-center gap-x-4 mt-2">
            <button className="bg-white rounded-full py-2 px-8 text-black font-semibold">Play all</button>
            <button className="bg-slate-300/40 rounded-full py-2 px-8 font-semibold">Shuffle</button>
        </div>
        </div>
      </div>
      <div className="w-[70vw] h-screen overflow-y-scroll">
        {videos.map((video, index)=>(
            <div key={video._id} className="w-full flex items-center justify-between px-10 py-4 cursor-pointer hover:bg-slate-300/40 rounded-xl" onClick={()=>handleCardClick(video)}>
                <div className="flex items-center gap-4">
                    <p>{index+1}</p>
                    <div className="w-[12vw] h-[14vh] bg-white rounded-lg overflow-hidden">
                        <img src={video.thumbnail} alt={video.title} className="w-full h-full"/>
                    </div>
                    <div>
                        <h1 className="font-semibold capitalize">{video.title}</h1>
                        <div className="flex items-center gap-x-4">
                            <p>{video.owner[0].fullName}</p>
                            <p>{video.views} views</p>
                            <p>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</p>
                        </div>
                    </div>
                </div>
                <button><BsThreeDotsVertical className="text-xl"/></button>
            </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default LikedVideos
