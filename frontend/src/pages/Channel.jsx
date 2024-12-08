import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserChannel, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../utils/User";
import { useForm } from "react-hook-form";

const Channel = () => {
  const { profile } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [modal, setModal] = useState("false");
  const { register, handleSubmit, formState: { errors, isSubmitted }, reset } = useForm();

  useEffect(()=>{
    const fetchChannel = async () => {
        try {
            const channelData = await getUserChannel(profile);
            // console.log(channelData.data);
            setChannel(channelData.data);
        } catch (error) {
            console.error("Failed to load channel: ",error);
        }
    }
    fetchChannel();
  },[profile]);

  const updateAvatar = async (data) => {
    try {
        // console.log(data.avatar[0]);
        const response = await updateUserAvatar(data.avatar[0]);
        console.log("Avatar updated successfully:", response);
        reset();
        alert("Profile picture updated successfully");
        setModal("false");
    } catch (error) {
        console.error("Error updating avatar: ",error);
        alert("Error updating avatar, please try again.");
    }
  }

  const updateCover = async (data) => {
    try {
        // console.log(data);
        const response = await updateUserCoverImage(data.coverImage[0]);
        console.log("Cover image updated successfully:", response);
        reset();
        alert("Profile banner updated successfully");
        setModal("false");
    } catch (error) {
        console.error("Error updating cover image:", error);
        alert("Error updating cover image, please try again.")
    }
  }
  const isError = isSubmitted && Object.keys(errors).length > 0;

  if (!channel) {
    return <div>Loading...</div>; // Loading state while waiting for channel data
  }
  return (
    <div className="min-h-screen">
        <div className="flex items-center justify-between py-5 px-4">
            <h1>Channel customisation</h1>
            <div className="flex items-center gap-4">
                <button onClick={()=>navigate(`/c/${channel.username}`)}>View channel</button>
                <button>Cancel</button>
                <button>Publish</button>
            </div>
        </div>
        <hr />
        <div className="px-4 py-10">
            <div className="mb-5">
              <h1>Banner Image</h1>
              <p>This image will appear on the top of your channel</p>
              <div className="flex gap-10">
                  <div className="bg-gray-800/50 h-[22vh] w-[25vw] rounded-xl box-border flex items-center justify-center">
                    <div className="w-[20vw] h-[19vh] rounded-xl flex items-center justify-center overflow-hidden">
                        <img src={channel.coverImage} alt={`current user ${channel.username}`} />
                    </div>
                  </div>
                  <div className="w-[30vw]">
                      <p>For the best results on all devices, use an image that is at least 2048 x 1152 pixels and 6 MB or less.</p>
                      <div className="flex items-center gap-4">
                          <button onClick={()=>setModal("coverImage")}>Change</button>
                          <button>Remove</button>
                      </div>
                  </div>
              </div>
            </div>
            <div className="mb-5">
              <h1>Picture</h1>
              <p>Your profile picture will appear where your channel is presented, such as next to your videos and comments</p>
              <div className="flex items-start gap-10">
                  <div className="bg-gray-800/50 h-[22vh] w-[25vw] rounded-xl box-border flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full overflow-hidden flex items-center justify-center">
                        <img src={channel.avatar} alt={`current user's ${channel.username}`} />
                    </div>
                  </div>
                  <div className="w-[30vw]">
                      <p>It is recommended that you use a picture that is at least 98 x 98 pixels and 4 MB or less. Use a PNG or GIF (no animations) file.</p>
                      <div className="flex items-center gap-4">
                          <button onClick={()=>setModal("avatar")}>Change</button>
                          <button>Remove</button>
                      </div>
                  </div>
              </div>
            </div>
            <div className="mb-5 w-[58vw]">
                <h1>Name</h1>
                <p>Choose a channel name that represents you and your content. You can change your channel name twice in 14 days</p>
                <input type="text" placeholder="Channel name" value={channel.fullName} className="w-full my-2 bg-transparent outline outline-[0.05rem] outline-gray-300 py-2 px-4 rounded-lg hover:outline-white focus:outline-white"/>
            </div>
            <div className="mb-5 w-[58vw]">
                <h1>Handle</h1>
                <p>Choose your unique handle by adding letters and numbers. You can change your handle back within 14 days. Handles can be changed twice every 14 days.</p>
                <input type="text" placeholder="Channel handle" value={`@${channel.username}`} className="w-full my-2 bg-transparent outline outline-[0.05rem] outline-gray-300 py-2 px-4 rounded-lg hover:outline-white focus:outline-white"/>
            </div>
            <div className="mb-5 w-[58vw]">
                <h1>Description</h1>
                <textarea name="" id="" placeholder="Channel description" value={channel.description || null} rows={10} className="w-full my-2 bg-transparent outline outline-[0.05rem] outline-gray-300 py-2 px-4 rounded-lg hover:outline-white focus:outline-white"></textarea>
            </div>
        </div>
        {modal!="false" && 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#71797E] rounded-3xl w-[70vw] h-[80vh]">
                <h2 className="text-xl font-semibold py-4 px-6">Upload {modal}</h2>
                <hr />
                <form onSubmit={modal=="coverImage"?handleSubmit(updateCover):handleSubmit(updateAvatar)}>
                    {isError && (
                      <p className="text-red-500 text-sm font-bold">
                        Required fields are missing. Please fill out all fields.
                      </p>
                    )}
                    <input type="file" accept="image/*" className={`w-full ${errors[modal] ? "border-red-500" : ""}`} {...register(modal, { 
                        required: true 
                    })}/>
                    <button type="submit">upload</button>
                </form>
                <button onClick={()=>setModal("false")}>Cancel</button>
            </div>
        </div>
        }
    </div>
  )
}

export default Channel;