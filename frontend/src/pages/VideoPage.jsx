import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ReactPlayer from 'react-player';
import { getVideoById } from '../utils/Video.js'; //  import the function
import { createComment, getCommentsById } from '../utils/Comment.js'; //  import the function
import { channelSubscribers } from '../utils/Subscription.js';
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { isLikedVideo, toggleVideoLike } from '../utils/Like.js';
import { CommentCard } from '../components/index.js';
import { useForm } from 'react-hook-form';

const VideoPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [subscribers, setSubscribers] = useState(0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitted } } = useForm();

  // Fetch video data and related details
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await getVideoById(videoId);
        const commentsData = await getCommentsById(videoId);
        setVideo(videoData.data);
        setComments(commentsData.data.docs || []);
        setLikes(videoData.data.video.likes);

        const owner = videoData.data?.video?.owner;
        if (owner){
          const subscriberData = await channelSubscribers(owner._id);
          setSubscribers(subscriberData.data.length || 0);
        }

        //Check if video is liked by user
        const likedStatus = await isLikedVideo(videoId);
        setLiked(likedStatus.data.isLiked);
        
        // Check if video is disliked by user
        const dislikedStatus = localStorage.getItem(`disliked_${videoId}`) === 'true';
        setDisliked(dislikedStatus);

      } catch (error) {
        console.error('Failed to load video:', error);
      }
    };
    fetchVideo();
  }, [videoId]);
  
  // Toggle like functionality
  const toggleLike = async () => {
    try {
      const response = await toggleVideoLike(videoId); // Make API call to toggle like/unlike
      // console.log(response);
      // // If the response is successful, handle the state change
      let data = response.data; // API response containing message and data
      // console.log(data);
      setLiked(!liked);  // Toggle the like state
      if (data) {
        setLikes((prev)=>prev+1);  // Update like count if new like is created
        setDisliked(false);  // Reset dislike state when like is toggled
        localStorage.removeItem(`disliked_${videoId}`); // Remove disliked state from localStorage
        alert("Video liked successfully!");
      } else {
        setLikes((prev)=>prev-1);  // Decrease like count if video was unliked
        alert("Video unliked successfully!");
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  // Toggle dislike functionality
  const toggleDislike = async () => {
    try {
      // If the video is liked, we first remove the like
      if (liked) {
        const response = await toggleVideoLike(videoId); // API call to toggle like/unlike
        let data = null;
        data = response.data; // API response containing message and data
        if(!data){
          setLikes(likes - 1); // Decrease like count
          setLiked(false); // Set liked state to false
        }
      }
      
      // Toggle dislike state and store it in localStorage
      setDisliked(!disliked);
      if(disliked){
        alert("Video undisliked successfully!");
      } else {
        alert("Video disliked successfully!");
      }
      localStorage.setItem(`disliked_${videoId}`, !disliked ? 'true' : 'false'); // Persist dislike state in localStorage
    } catch (error) {
      console.error('Failed to toggle dislike:', error);
    }
  };

  // Add a new comment
  const commentCreation = async (data) => {
    // Placeholder for comment creation logic (API call or state update)
    try {
        const response = await createComment(videoId, data);
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
  if (!video) return <div>Loading...</div>;
  const { video: videoDetails, user: loggedUser } = video;

  return (
    <div className="video-page px-4 py-10 min-h-screen bg-black">
      {/* Video Player */}
      <div>
      <ReactPlayer url={videoDetails.videoFile} height="70vh" width="75vw" controls playing muted/>
      <h1 className='mb-2 capitalize'>{videoDetails.title}</h1>
      <div className='flex justify-between w-[75vw] pr-3'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full overflow-hidden'>
              <img src={videoDetails.owner.avatar} alt={`${videoDetails.owner.username}'s avatar`} />
          </div>
          <div className='leading-4'>
              <h1 className='mb-1 capitalize'>{videoDetails.owner.username}</h1>
              <h2>{subscribers} subscribers</h2>
          </div>
        </div>
        {/* Like/Dislike Buttons */}
        <div className='flex items-center justify-evenly'>
          <div className='text-xl font-light bg-gray-400/40 rounded-full flex items-center p-2'>
            <button className='px-5 border-r-white border-r flex items-center gap-2' onClick={toggleLike}>{!liked?<BiLike className='text-2xl'/>:<BiSolidLike className='text-2xl'/>}{likes}</button>
            <button className='px-5' onClick={toggleDislike}>{!disliked?<BiDislike className='text-2xl'/>:<BiSolidDislike className='text-2xl'/>}</button>
          </div>
        </div>
      </div>
      {/* Video Details */}
      <p>
      <span>{videoDetails.views} views </span>
      <span>{videoDetails.createdAt ? formatDistanceToNow(new Date(videoDetails.createdAt), { addSuffix: true }) : 'Unknown'}</span>
      </p>
      <p>{videoDetails.description}</p>
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
                    <img src={video.user.avatar} alt="" />
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
            <CommentCard key={comment._id} comment={comment} deleteCommentHandler={deleteCommentHandler}/>
        ))}
      </div>
    </div>
  );
};

export default VideoPage;