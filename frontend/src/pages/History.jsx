import { useEffect, useState } from "react";
import { userWatchHistory } from "../utils/User";
import { useSelector } from "react-redux";
import { VideoCard } from "../components";

const History = () => {
  const [userHistory, setUserHistory] = useState(null);
  const user = useSelector(state => state.auth.user);
  useEffect(()=>{
    const userHistory = async () => {
        try {
            if(user){
                const response = await userWatchHistory();
                console.log("User histroy fetched", response);
                setUserHistory(response.data);
            }
        } catch (error) {
            console.error('Error fetching user history:', error);
            alert('Error fetching user history, please try again');
        }
    }
    userHistory();
  },[user]);
  if(userHistory==null){
    return <div>loading</div>
  }
  return (
    <div className="p-10">
            {userHistory.map((video) => (
                <div key={video._id} className="w-full my-4 flex items-start gap-8">
                    <div className="w-1/3 h-[30vh] rounded-2xl overflow-hidden flex items-center">
                        <img src={video.thumbnail} alt="" className="h-full w-full"/>
                    </div>
                    <div className="w-1/2">
                        <p>{video.title}</p>
                        <div className="flex items-center gap-2">
                            <p>{video.owner.fullName}</p>
                            <p>{video.views} views</p>
                        </div>
                        <p>{video.description}</p>
                    </div>
                </div>
            ))}
    </div>
  )
}

export default History
