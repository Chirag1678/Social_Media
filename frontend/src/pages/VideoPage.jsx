import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ReactPlayer from 'react-player';
import { getVideoById } from '../utils/Video.js'; //  import the function
import { getCommentsById } from '../utils/Comment.js'; //  import the function
import { channelSubscribers } from '../utils/Subscription.js';
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { isLikedVideo, toggleVideoLike } from '../utils/Like.js';

const VideoPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [subscribers, setSubscribers] = useState(0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await getVideoById(videoId);
        const commentsData = await getCommentsById(videoId);
        setVideo(videoData.data);
        setComments(commentsData.data);
        setLikes(videoData.data.video.likes);
        const owner = videoData.data?.video?.owner;
        if (owner){
          const subscriberData = await channelSubscribers(owner._id);
          setSubscribers(subscriberData.data.length);
        }
        //Check if video is liked by user
        const likedStatus = await isLikedVideo(videoId);
        setLiked(likedStatus.data.isLiked);

        // Check if video is disliked by user
        const storedDislikeStatus = localStorage.getItem(`disliked_${videoId}`);
        if (storedDislikeStatus === 'true') {
          setDisliked(true); // Set disliked state from localStorage
        }
      } catch (error) {
        console.error('Failed to load video:', error);
      }
    };
    fetchVideo();
  }, [videoId]);
  // console.log(video);
//   console.log(comments.docs);
  const toggleLike = async () => {
    try {
      const response = await toggleVideoLike(videoId); // Make API call to toggle like/unlike
      // console.log(response);
      // // If the response is successful, handle the state change
      let data = null;
      data = response.data; // API response containing message and data
      // console.log(data);
      setLiked(!liked);  // Toggle the like state
      if (data) {
        setLikes(likes+1);  // Update like count if new like is created
        setLiked(!liked);  // Toggle the like state
        alert("Video liked successfully!");
      } else {
        setLikes(likes - 1);  // Decrease like count if video was unliked
        setLiked(false);  // Set liked state to false
        alert("Video unliked successfully!");
      }

      // Reset dislike state when like is toggled
      setDisliked(false);
      localStorage.removeItem(`disliked_${videoId}`); // Remove disliked state from localStorage
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };
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
  const owner = video?.video?.owner;
  if (!video) return <div>Loading...</div>;

  return (
    <div className="video-page px-4 py-10 min-h-screen bg-black">
      <div>
      <ReactPlayer url={video.video.videoFile} height="70vh" width="75vw" controls playing/>
      <h1 className='mb-2 capitalize'>{video.video.title}</h1>
      <div className='flex justify-between w-[75vw] pr-3'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full overflow-hidden'>
              <img src={owner.avatar} alt={`${owner.username}'s avatar`} />
          </div>
          <div className='leading-4'>
              <h1 className='mb-1 capitalize'>{owner.username}</h1>
              <h2>{subscribers} subscribers</h2>
          </div>
        </div>
        <div className='flex items-center justify-evenly'>
          <div className='text-xl font-light bg-gray-400/40 rounded-full flex items-center p-2'>
            <button className='px-5 border-r-white border-r flex items-center gap-2' onClick={toggleLike}>{!liked?<BiLike className='text-2xl'/>:<BiSolidLike className='text-2xl'/>}{likes}</button>
            <button className='px-5' onClick={toggleDislike}>{!disliked?<BiDislike className='text-2xl'/>:<BiSolidDislike className='text-2xl'/>}</button>
          </div>
        </div>
      </div>
      <p>
      <span>{video.video.views} views </span>
      <span>{video.video.createdAt ? formatDistanceToNow(new Date(video.video.createdAt), { addSuffix: true }) : 'Unknown'}</span>
      </p>
      <p>{video.video.description}</p>
      </div>
      <div className='comment-section w-[75vw] mt-10'>
        <p className='flex gap-8'>
            <span>{comments.totalDocs} Comments</span>
            <span>Sort By</span>
        </p>
        <form action="" method='post' className='flex gap-4 items-start mt-5'>
            <label htmlFor='comment'>
                <div className='w-10 h-10 rounded-full overflow-hidden flex items-center justify-center'>
                    <img src={video.user.avatar} alt="" />
                </div>
            </label>
            <div className='w-full'>
            <input type="text" placeholder='Add a comment' className='bg-transparent outline-none border-b-[0.05rem] p-[0.15rem] w-full'/>
            <button type="reset">Cancel</button>
            <button type="submit">Comment</button>
            </div>
        </form>
        {comments.docs.map((comment)=>(
            <div key={comment._id} className='flex gap-4 mt-5'>
                <div className='w-10 h-10 rounded-full overflow-hidden'>
                    <img src={comment.owner?.[0].avatar} alt="" />
                </div>
                <div>
                    <div className='flex items-center gap-2'><span className='capitalize'>{comment.owner?.[0].username}</span>
                    <span>{comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Unknown'}</span></div>
                    <p>{comment.content}</p>
                    <div className='flex items-center gap-3'>
                      <button className='flex items-center gap-2'><BiLike className='text-xl'/> 0</button>
                      <button><BiDislike className='text-xl' /></button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPage;