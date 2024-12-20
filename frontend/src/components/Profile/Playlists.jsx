import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, PlaylistCard, TextArea } from "../index";
import { createPlaylist, getUserPlaylists } from "../../utils/Playlist";

const Playlists = ({userId}) => {
    // console.log(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm();
  const [playlists, setPlaylists] = useState([]);

  const openModal = () => setIsModalOpen(true); // Open modal
  const closeModal = () => setIsModalOpen(false); // Close modal

  useEffect(() => {
    const fetchUserPlaylists = async () => {
        try {
            const response = await getUserPlaylists(userId);
            // console.log(response.data.playlists);
            setPlaylists(response.data.playlists);
        } catch (error) {
            console.error("Error fetching playlists: "+error);
            alert("Error fetching playlists, please try again");
        }
    }
    fetchUserPlaylists();
  }, [userId]);
  const playlistCreation = async (data) => {
    // Placeholder for playlist creation logic (API call or state update)
    try {
        const response = await createPlaylist(data.title,data.description);
        console.log("Playlist created successfully:", response);
        alert("Playlist created successfully!");
        document.querySelector("form").reset();
        closeModal();
    } catch (error) {
        console.error("Error creating playlist:", error);
        alert("Failed to create playlist. Please try again.");
    }
  };

  const isError = isSubmitted && Object.keys(errors).length > 0;

  return (
    <div>
      {!playlists && <div className="flex items-center justify-center mt-20 mb-5">
        <div className="text-center">
          <div className="h-40 w-40 rounded-full bg-green-500 mx-auto mb-4"></div>
          <p>Create your playlist, then add existing content or upload new videos.</p>
        </div>
      </div>}
      {playlists && <div>
        {playlists.map((playlist) => (
            <PlaylistCard key={playlist._id} playlist={playlist}/>
        ))}
      </div>}
      <div className="text-center">
        <button
          className="bg-white text-black cursor-pointer py-2 px-4 rounded-full font-medium"
          onClick={openModal}
        >
          New Playlist
        </button>
      </div>
      
      {/* Modal for Playlist Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#71797E] rounded-3xl w-[70vw] h-[80vh]">
            <h2 className="text-xl font-semibold py-4 px-6">Create a new playlist</h2>
            <hr />
            <h2 className="font-medium text-2xl mt-3 px-6">Details</h2>
            <div className="px-6">
              <form onSubmit={handleSubmit(playlistCreation)} className="text-black">
                {/* Common Error Message */}
                {isError && (
                  <p className="text-red-500 text-sm font-bold">
                    Required fields are missing. Please fill out all fields.
                  </p>
                )}

                {/* Title Field */}
                <Input 
                  label="Title: " 
                  placeholder="Add title" 
                  type="text" 
                  name="title" 
                  className={errors.title ? "border-red-500" : ""} 
                  {...register("title", { required: true })}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">Title is required</p>
                )}

                {/* Description Field */}
                <TextArea 
                  label="Description: " 
                  placeholder="Add description" 
                  name="description" 
                  {...register("description")}
                />
                
                <div className="flex justify-end gap-3 mt-2">
                  <Button bgColor="bg-gray-300" onClick={closeModal}>Cancel</Button>
                  <Button type="submit" bgColor="bg-blue-500">Create Playlist</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Playlists;