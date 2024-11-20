import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserChannel } from "../utils/User.js";
import { format } from "date-fns";

const Profile = () => {
  const { profile } = useParams();
  const [channel, setChannel] = useState(null);
  useEffect(()=>{
      const fetchChannel = async () => {
          try {
              const channelData = await getUserChannel(profile);
              setChannel(channelData.data);
          }
          catch (error) {
              console.error('Failed to load channel:', error);
          }
      }
      fetchChannel();
  },[profile]);
  console.log(channel);
  if (!channel) {
      return <div>Loading...</div>; // Loading state while waiting for channel data
  }
  const formattedDate = format(new Date(channel.createdAt), "MMM dd, yyyy");
  return (
    <div className="px-4 py-10 min-h-screen bg-black">
      <div className="flex w-full items-center gap-4">
        <div className="w-40 h-40 rounded-full flex items-center justify-center overflow-hidden">
            <img src={channel.avatar} alt={`current user ${channel.username}`} />
        </div>
        <div>
            <p>{channel.fullName}</p>
            <p>@{channel.username}</p>
            <p>Joined {formattedDate}</p>
            <div className="flex items-center gap-3">
                <button>Customize channel</button>
                <button>Manage videos</button>
            </div>
        </div>
      </div>
      <div className="mt-3 pb-2 flex items-center gap-4 border-b-[0.05rem]">
        <span>Home</span>
        <span>Playlists</span>
        <span>Tweets</span>
      </div>
    </div>
  )
}

export default Profile
