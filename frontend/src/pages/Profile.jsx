import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserChannel } from "../utils/User.js";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { createVideo } from "../utils/Video.js";
import { useSelector } from "react-redux";
import VideoCard from "../components/Video/VideoCard.jsx";

const Profile = () => {
  const { profile } = useParams();
  const [channel, setChannel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit } = useForm();
  const [filteredvideos, setFilteredVideos] = useState([]);
  const video = useSelector((state) => state.video.videos);
  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const channelData = await getUserChannel(profile);
        setChannel(channelData.data);

        // Filter videos where owner username matches the current profile username
        const userVideos = video.docs.filter(
          (vid) => vid.owner?.[0].username === channelData.data.username
        );
        setFilteredVideos(userVideos);
      } catch (error) {
        console.error("Failed to load channel:", error);
      }
    };
    fetchChannel();
  }, [profile, video]);
  console.log(filteredvideos);
  const videoCreation = async (data) => {
    // console.log(data);
    try {
      const response = await createVideo(data);
      console.log("Video created successfully:", response);
      alert("Video uploaded successfully!");
      closeModal();
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
    }
  };
  // console.log(channel);
  const openModal = () => setIsModalOpen(true); // Open modal
  const closeModal = () => setIsModalOpen(false); // Close modal
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
      {!filteredvideos && <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="h-40 w-40 rounded-full bg-green-500 mx-auto"></div>
          <p>Create content on any device</p>
          <p>
            Upload or record at home or on the go.
            <br />
            Everythin you make public will appear here.
          </p>
        </div>
      </div>}
      {filteredvideos && <div className="flex gap-16 mt-4">
        {filteredvideos.map((video) => (
          <VideoCard key={video._id} video={video}/>
        ))}
      </div>}
      <div className="text-center">
      <button
        className="bg-white text-black cursor-pointer py-2 px-4 rounded-full font-medium"
        onClick={openModal}
      >
      Upload Videos
      </button>
      </div>
      {/* Modal for Upload */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#71797E] rounded-3xl w-[70vw] h-[80vh]">
            <h2 className="text-xl font-semibold py-4 px-6">Upload Videos</h2>
            <hr />
            <h2 className="font-medium text-2xl mt-3 px-6">Details</h2>
            <div className="px-6">
              <form onSubmit={handleSubmit(videoCreation)} className="text-black">
                <div>
                  <label htmlFor="title">Title (required)</label>
                  <br />
                  <input
                    type="text"
                    name="title"
                    placeholder="Add a title"
                    {...register("title", { required: true })}
                  />
                </div>
                <div>
                  <label htmlFor="description">Description</label>
                  <br />
                  <textarea
                    name="description"
                    placeholder="Add a description"
                    {...register("description")}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="videoFile">Video</label>
                  <br />
                  <input
                    type="file"
                    accept="video/*"
                    className="block w-full mb-4"
                    name="videoFile"
                    {...register("videoFile", { required: true })}
                  />
                </div>
                <div>
                  <label htmlFor="thumbnail">Thumbnail</label>
                  <br />
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full mb-4"
                    name="thumbnail"
                    {...register("thumbnail", { required: true })}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    className="py-2 px-4 bg-gray-300 rounded"
                    onClick={closeModal} // Close modal
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 bg-blue-500 text-white rounded"
                  >
                    Upload
                  </button>
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
