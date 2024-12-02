import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import { getTweetById } from "../utils/Tweet";
import { createTweetComment, getTweetCommentsById } from "../utils/Comment";
import { CommentCard, TweetCard } from "../components";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const TweetPage = () => {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState(null);
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const loggedInUser = useSelector((state) => state.auth.user);

  const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm();

  //Fetch tweet data and related details
  useEffect(() => {
    const fetchTweet = async () => {
      try {
        if(loggedInUser){
          setUser(loggedInUser.data);
        }
        const tweetData = await getTweetById(tweetId);
        const commentsData = await getTweetCommentsById(tweetId);
        // console.log(tweetData.data.tweet[0]);
        setTweet(tweetData.data.tweet[0]);
        setComments(commentsData.data.docs || []);
        // Call the getCommentsById function and set the comments state
      } catch (error) {
        console.error("Failed to load tweet:", error);
      }
    };
    fetchTweet();
  }, [tweetId, loggedInUser]);

  // Add a new comment
  const commentCreation = async (data) => {
    // Placeholder for comment creation logic (API call or state update)
    try {
        const response = await createTweetComment(tweetId, data);
        // console.log(data);
        console.log("Comment created successfully:", response);
        setComments((prevComments) => [response.data, ...prevComments]);
        alert("Comment created successfully!");
        document.querySelector("form").reset();
    } catch (error) {
        console.error("Error creating comment:", error);
        alert("Failed to create comment. Please try again.");
    }
  };
  const deleteCommentHandler = (commentId) => {
    setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
  };
  const updateCommentHandler = (commentId, newContent) => {
    setComments((prevComments) => prevComments.map((comment) => comment._id === commentId ? { ...comment, content: newContent } // Update content for the matching comment
    : comment)
    );
  };
  return (
    <div className="min-h-screen pb-5 flex-col flex items-center">
      <div className="w-[75vw]">
        {tweet && <TweetCard tweet={tweet} />}
      </div>
      {/* Comments Section */}
      <div className='comment-section w-[75vw] mt-10'>
        <p className='flex gap-8'>
            <span>{comments.length} Comments</span>
            <span>Sort By</span>
        </p>
        <form onSubmit={handleSubmit(commentCreation)} className='flex gap-4 items-start mt-5'>
            <label htmlFor='comment'>
                <div className='w-10 h-10 rounded-full overflow-hidden flex items-center justify-center'>
                    <img src={user?.avatar} alt="" />
                </div>
            </label>
            <div className='w-full'>
              <input type="text" placeholder='Add a comment' className='bg-transparent outline-none border-b-[0.05rem] p-[0.15rem] w-full' name='content' {...register("content",{
                  required:true,
              })}/>
              {errors.content && <p className="text-red-500 text-sm font-bold">Comment is required</p>}
              <button type="reset">Cancel</button>
              <button type="submit">Comment</button>
            </div>
        </form>
        {comments.map((comment)=>(
            <CommentCard key={comment._id} comment={comment} deleteCommentHandler={deleteCommentHandler} updateCommentHandler={updateCommentHandler}/>
        ))}
      </div>
    </div>
  )
}

export default TweetPage
