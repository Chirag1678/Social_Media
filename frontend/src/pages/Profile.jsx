import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserChannel } from "../utils/User.js";
import { format } from "date-fns";
// import { useForm } from "react-hook-form";
// import { createVideo } from "../utils/Video.js";
// import { useSelector } from "react-redux";
import { ProfileHome, ProfilePlaylists, ProfileTweets } from "../components/index.js";
import { allVideos } from "../utils/Video.js";
import { useDispatch } from "react-redux";
import { setVideos } from "../store/videoSlice.js";
import { getUserPlaylists } from "../utils/Playlist.js";
import { setPlaylists } from "../store/playlistSlice.js";
import { getUserTweets } from "../utils/Tweet.js";
import { setTweets } from "../store/tweetSlice.js";

const Profile = () => {
  const { profile } = useParams();
  const [channel, setChannel] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channelData = await getUserChannel(profile);
        setChannel(channelData.data);
        const videos = await allVideos();
        const filteredVideos = videos.data.docs.filter((video) => video.owner[0].username === profile);
        dispatch(setVideos(filteredVideos));
        const playlists = await getUserPlaylists(channelData.data._id);
        dispatch(setPlaylists(playlists.data));
        const tweets = await getUserTweets(channelData.data._id);
        dispatch(setTweets(tweets.data));
      } catch (error) {
        console.error("Failed to load channel:", error);
      }
    };
    fetchChannel();
  }, [profile, dispatch]);
  // console.log(channel?._id);
  // const id=channel?._id;
  if (!channel) {
    return <div>Loading...</div>; // Loading state while waiting for channel data
  }
  const formattedDate = format(new Date(channel.createdAt), "MMM dd, yyyy");
  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <ProfileHome/>;
      case "playlists":
        return <ProfilePlaylists/>;
      case "tweets":
        return <ProfileTweets/>;
      default:
        return <ProfileHome profile={profile} />;
    }
  };
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
      <div className="mt-3 flex items-center gap-4 border-b-[0.05rem]">
      <button
          className={`${activeTab === "home" ? "font-bold border-b-2 border-white" : "text-white"} p-2`}
          onClick={() => setActiveTab("home")}
        >
          Home
        </button>
        <button
          className={`${activeTab === "playlists" ? "font-bold border-b-2 border-white" : "text-white"} p-2`}
          onClick={() => setActiveTab("playlists")}
        >
          Playlists
        </button>
        <button
          className={`${activeTab === "tweets" ? "font-bold border-b-2 border-white" : "text-white"} p-2`}
          onClick={() => setActiveTab("tweets")}
        >
          Tweets
        </button>
      </div>
      <div className="mt-4">{renderContent()}</div>
    </div>
  );
};

export default Profile;
