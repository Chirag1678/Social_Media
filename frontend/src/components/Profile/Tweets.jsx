import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, TweetCard } from "../index";
import { createTweet } from "../../utils/Tweet";
import { useSelector } from "react-redux";
const Tweets = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitted }} = useForm();
  const [tweets, setTweets] = useState([]);

  const openModal = () => setIsModalOpen(true); // Open modal
  const closeModal = () => setIsModalOpen(false); // Close modal

  const tweet = useSelector((state) => state.tweet.tweets);
  useEffect(() => {
      if (tweet) {
        setTweets(tweet.tweets); // Update state only when `tweet` changes
      }
  }, [tweet]);
//   console.log(tweets);
  const tweetCreation = async (data) => {
    // Placeholder for tweet creation logic (API call or state update)
    try {
        const response = await createTweet(data);
        // console.log(data);
        console.log("Tweet created successfully:", response);
        alert("Tweet created successfully!");
        document.querySelector("form").reset();
        closeModal();
    } catch (error) {
        console.error("Error creating tweet:", error);
        alert("Failed to create tweet. Please try again.");
    }
  };

  const isError = isSubmitted && Object.keys(errors).length > 0;

  return (
    <div>
      {tweets.length===0 && <div className="flex items-center justify-center mt-20 mb-5">
        <div className="text-center">
          <div className="h-40 w-40 rounded-full bg-green-500 mx-auto mb-4"></div>
          <p>Create new Tweet, for you audience to connect.</p>
        </div>
      </div>}
      {tweets.length>0 && <div className="px-2">
        {tweets.map((tweet) => (
            // <div key={tweet._id}>
            //     <h2>{tweet.content}</h2>
            // </div>
            <TweetCard key={tweet._id} tweet={tweet}/>
        ))}
      </div>}
      <div>
      <div className="text-center">
        <button
          className="bg-white text-black cursor-pointer py-2 px-4 rounded-full font-medium"
          onClick={openModal}
        >
          New Tweet
        </button>
      </div>
        {/* Modal for Playlist Creation */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                 <div className="bg-[#71797E] rounded-3xl w-[70vw] h-[80vh]">
                    <h2 className="text-xl font-semibold py-4 px-6">Create a new Tweet</h2>
                    <hr />
                    <h2 className="font-medium text-2xl mt-3 px-6">Details</h2>
                    <div className="px-6">
                      <form onSubmit={handleSubmit(tweetCreation)} className="text-black">
                          {/* Common Error Message */}
                          {isError && (
                            <p className="text-red-500 text-sm font-bold">
                              Required fields are missing. Please fill out all fields.
                            </p>
                          )}
                          <Input label="Content: " placeholder="Enter your tweet" type="text" name="content" {...register("content",{
                              required:true,
                          })}/>
                          {errors.content && <p className="text-red-500 text-sm font-bold">Content is required</p>}
                          <Input label="Image: " placeholder="Enter your image" type="file" name="image" {...register("image")}/>
                          <div className="flex justify-end gap-3 mt-2">
                              <Button bgColor="bg-gray-300" onClick={closeModal}>Cancel</Button>
                              <Button type="submit" bgColor="bg-blue-500">Create Tweet</Button>
                          </div>
                      </form>
                    </div>
                 </div>
            </div>
        )}
      </div>
    </div>
  )
}

export default Tweets
