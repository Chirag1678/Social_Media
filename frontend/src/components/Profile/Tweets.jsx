import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, TextArea } from "../index";
import { createTweet } from "../../utils/Tweet";
import { useSelector } from "react-redux";
const Tweets = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm();
  const [tweets, setTweets] = useState([]);

  const openModal = () => setIsModalOpen(true); // Open modal
  const closeModal = () => setIsModalOpen(false); // Close modal

  const tweet = useSelector((state) => state.tweet.tweets);
  useEffect(() => {
      if (tweet) {
        setTweets(tweet.tweets); // Update state only when `tweet` changes
      }
  }, [tweet]);
  console.log(tweets);
  const tweetCreation = async (data) => {
    // Placeholder for tweet creation logic (API call or state update)
    try {
        const response = await createTweet(data.content);
        console.log("Tweet created successfully:", response);
        alert("Tweet created successfully!");
        closeModal();
    } catch (error) {
        console.error("Error creating tweet:", error);
        alert("Failed to create tweet. Please try again.");
    }
  };

  const isError = isSubmitted && Object.keys(errors).length > 0;

  return (
    <div>
      {tweets && <div className="flex items-center justify-center mt-20 mb-5">
        <div className="text-center">
          <div className="h-40 w-40 rounded-full bg-green-500 mx-auto mb-4"></div>
          <p>Create your playlist, then add existing content or upload new videos.</p>
        </div>
      </div>}
      <div className="text-center">
        <button
          className="bg-white text-black cursor-pointer py-2 px-4 rounded-full font-medium"
          onClick={openModal}
        >
          New Playlist
        </button>
        {/* Modal for Playlist Creation */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                 <div className="bg-[#71797E] rounded-3xl w-[70vw] h-[80vh]">
                    <h2 className="text-xl font-semibold py-4 px-6">Create a new Tweet</h2>
                    <hr />
                    <h2 className="font-medium text-2xl mt-3 px-6">Details</h2>
                    <div className="px-6"></div>
                    <form action="" method="post">
                        <div className="flex justify-end gap-3 mt-2">
                            <Button bgColor="bg-gray-300" onClick={closeModal}>Cancel</Button>
                            <Button type="submit" bgColor="bg-blue-500">Create Playlist</Button>
                        </div>
                    </form>
                 </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default Tweets
