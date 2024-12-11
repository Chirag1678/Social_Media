import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { VideoCard } from "../index.js";
import { createVideo, deleteVideo, toggleVideoStatus, updateVideo } from "../../utils/Video.js";
import {Button, Input, TextArea, Select} from "../index"

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitted }  } = useForm();
  const [filteredvideos, setFilteredVideos] = useState([]);
  const video = useSelector((state) => state.video.videos);

  useEffect(() => {
    if (video) {
      setFilteredVideos(video); // Update state only when `video` changes
    }
  }, [video]);

  const videoCreation = async (data) => {
    try {
      const response = await createVideo(data);
      console.log("Video created successfully:", response);
      setFilteredVideos((prev) => [...prev, response.data]);
      alert("Video uploaded successfully!");
      document.querySelector("form").reset();
      closeModal();
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
    }
  };

  const videoDeletion = async (videoId) => {
    try {
        const verify = confirm("Are you sure you want to delete");
        if(verify){
            const response = await deleteVideo(videoId);
            setFilteredVideos((prev) => prev.filter((vid) => vid._id !== videoId));
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
        setFilteredVideos((prevVideos) =>
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

  const videoToggle = async (videoId) => {
    try {
      const response = await toggleVideoStatus(videoId);
      console.log("Video toggled successfully", response);

      // Update the filteredVideos state
      setFilteredVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId
            ? {
                ...video,
                isPublished: response.data?.isPublished || video.isPublished
              }
            : video
          )
      );
      alert("Video toggled successfully");
    } catch (error) {
      console.error("Error in video toggle:", error);
      alert("Failed to toggle video, please try again.");
    }
  }

  const isError = isSubmitted && Object.keys(errors).length > 0;
//   console.log(filteredvideos);
  const openModal = () => setIsModalOpen(true); // Open modal
  const closeModal = () => setIsModalOpen(false); // Close modal
  return (
    <div>
        {filteredvideos.length==0 && <div className="flex items-center justify-center h-[60vh]">
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
      {filteredvideos && <div className="flex gap-16">
        {filteredvideos.map((video) => (
          <VideoCard key={video._id} video={video} onDelete={()=>videoDeletion(video._id)} onUpdate={videoUpdation} onToggle={()=>videoToggle(video._id)}/>
        ))}
      </div>}
      <div className="text-center">
      <button
        className="bg-white text-black cursor-pointer py-2 px-4 rounded-full font-medium "
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
                {/* Common Error Message */}
                {isError && (
                  <p className="text-red-500 text-sm font-bold">
                    Required fields are missing. Please fill out all fields.
                  </p>
                )}
                <Input label="Title: " placeholder="Add a title" type="text" name="title" className={errors.title ? "border-red-500" : ""} {...register("title",{
                    required:true,
                })}/>
                {errors.title && (
                <p className="text-red-500 text-sm">Title is required</p>
                )}
                <TextArea label="Description: " placeholder="Add a description" name="description" {...register("description")}/>
                <Input label="Video: " type="file" accept="video/*" name="videoFile" className={errors.videoFile ? "border-red-500" : ""} {...register("videoFile", {
                    required:true,
                })}/>
                {errors.videoFile && (
                <p className="text-red-500 text-sm">Video File is required</p>
                )}
                <Input label="Thumbnail: " type="file" accept="image/*" name="thumbnail" className={errors.thumbnail ? "border-red-500" : ""} {...register("thumbnail", {
                    required:true,
                })}/>
                {errors.thumbnail && (
                <p className="text-red-500 text-sm">Thumbnail is required</p>
                )}
                <Select label="Status: " defaultValue="public" {...register("status", { 
                    required: true 
                })}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </Select>
                <div className="flex justify-end gap-3 mt-2">
                  <Button bgColor="bg-gray-300" onClick={closeModal}>Cancel</Button>
                  <Button type="submit" bgColor="bg-blue-500">Upload</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home;
