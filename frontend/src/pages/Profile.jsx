import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserChannel, updatePassword } from "../utils/User.js";
import { format } from "date-fns";
// import { useForm } from "react-hook-form";
// import { createVideo } from "../utils/Video.js";
// import { useSelector } from "react-redux";
import { Button, Input, ProfileHome, ProfilePlaylists, ProfileTweets } from "../components/index.js";
import { allVideos } from "../utils/Video.js";
import { useDispatch, useSelector } from "react-redux";
import { setVideos } from "../store/videoSlice.js";
import { getUserTweets } from "../utils/Tweet.js";
import { setTweets } from "../store/tweetSlice.js";
import { toggleSubscribtion } from "../utils/Subscription.js";
import { useForm } from "react-hook-form";
import { logout } from "../store/authSlice.js";
import { logoutUser } from "../utils/User.js";
import { channelStats, channelVideos } from "../utils/Dashboard.js";

const Profile = () => {
  const { profile } = useParams();
  const loggedInUser = useSelector((state) => state.auth.user);
  const [modal,setModal] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitted }  } = useForm();
  let userChannel = false;
  if (loggedInUser) {
    if (loggedInUser.data.username === profile) {
      userChannel = true;
    }
  }
  // console.log(userChannel);
  const [channel, setChannel] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [filteredVideos, setFilteredVideos] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channelData = await getUserChannel(profile);
        // console.log(channelData);
        setChannel(channelData.data);
        const videos = await allVideos();
        let filteredVideos = videos.data.docs.filter((video) => video.owner[0].username === profile);
        if(!userChannel){
          filteredVideos = filteredVideos.filter((video)=> video.isPublished ===true);
        }
        setFilteredVideos(filteredVideos.length);
        dispatch(setVideos(filteredVideos));
        // const playlists = await getUserPlaylists(channelData.data._id);
        // dispatch(setPlaylists(playlists.data));
        const tweets = await getUserTweets(channelData.data._id);
        dispatch(setTweets(tweets.data));
      } catch (error) {
        console.error("Failed to load channel:", error);
      }
    };
    fetchChannel();
  }, [profile, dispatch, userChannel]);
  // console.log(channel);
  const toggleSubscribe = async () => {
    try {
      const response = await toggleSubscribtion(channel._id); // Call the subscription API
      console.log(response);
      setChannel((prevChannel) => ({
        ...prevChannel,
        isSubscribed: !prevChannel.isSubscribed, // Toggle the subscription status
      }));
      alert(
        !channel.isSubscribed
          ? "Subscribed to channel!"
          : "Unsubscribed from channel!"
      );
    } catch (error) {
      console.error("Failed to toggle subscription:", error);
      alert("Failed to toggle subscription. Please try again.");
    }
  };

  const updateUserPassword = async (data) => {
    try {
      // console.log(data);
      const response = await updatePassword(data);
      console.log(typeof response.status);
      if (response?.statusCode === 200 || response?.success) {
        console.log('Password updated successfully: ');
        alert('Password updated successfully, please login again');
        logoutUser();
        dispatch(logout());
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to update password:', error);
      alert("Failed to update password, please try again.");
    }
  };
  const isError = isSubmitted && Object.keys(errors).length > 0;
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
        return <ProfilePlaylists userId={channel?._id}/>;
      case "tweets":
        return <ProfileTweets/>;
      default:
        return <ProfileHome profile={profile} />;
    }
  };
  return (
    <div className="px-4 py-10 min-h-screen bg-black">
      <div className="h-[20vh] w-full bg-red-500 rounded-2xl mb-5 overflow-hidden flex items-center justify-center">
        <img src={channel.coverImage} alt={`current user ${channel.username}`}/>
      </div>
      <div className="flex w-full items-center gap-4">
        <div className="w-40 h-40 rounded-full overflow-hidden flex items-center justify-center">
          <img src={channel.avatar} alt={`current user ${channel.username}`} />
        </div>
        <div>
          <p>{channel.fullName}</p>
          <div className="flex items-center gap-2">
            <p>@{channel.username} </p>
            {!userChannel && <><p>. {channel.subscriberCount} subscribers</p>
            <p>. {filteredVideos} videos</p></>}
          </div>
          <p>Joined {formattedDate}</p>
          {userChannel && <>
            <div className="flex items-center gap-3">
              <button onClick={()=>navigate(`/channel/${channel.username}`)}>Customize channel</button>
              <button>Manage videos</button>
            </div>
            <button onClick={()=>setModal(!modal)}>Change Password</button>
          </>}
          {!userChannel && <div>
            {!channel.isSubscribed && <Button bgColor="bg-white" className="mt-3 font-semibold" textColor="text-black" onClick={toggleSubscribe}>Subscribe</Button>}
            {channel.isSubscribed && <Button bgColor="bg-gray-500" className="mt-3 font-semibold" textColor="text-white" onClick={toggleSubscribe}>Subscribed</Button>}
          </div>}
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
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#71797E] rounded-3xl w-[70vw] h-[80vh]">
            <h2 className="text-xl font-semibold py-4 px-6">Change Password</h2>
            <hr />
            <div className="px-6 mt-3">
              <form onSubmit={handleSubmit(updateUserPassword)}>
                {isError &&
                  <p className="text-red-500 text-sm font-bold">
                    All fields are required, please provide current and new passowrd for update
                  </p> 
                }
                <Input label="Current Password:" type="text" placeholder="Current Password" className={errors.currentPassword ? "border-red-500" : ""} {...register('currentPassword', {
                  required: true
                })}/>
                {errors.currentPassword && (
                <p className="text-red-500 text-sm">Required field</p>
                )}
                <Input label="New Password:" type="text" placeholder="new Password" className={errors.newPassword ? "border-red-500" : ""} {...register('newPassword', {
                  required: true
                })}/>
                {errors.newPassword && (
                <p className="text-red-500 text-sm">Required field</p>
                )}
                <div className="flex justify-end gap-3 mt-2">
                  <Button type="button" bgColor="bg-gray-300" onClick={()=>setModal(false)}>Cancel</Button>
                  <Button type="submit" bgColor="bg-blue-500">Change Password</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
