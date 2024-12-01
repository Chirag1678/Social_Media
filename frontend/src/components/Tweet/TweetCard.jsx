import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { isLikedTweet, toggleTweetLike } from '../../utils/Like';
import { MdOutlineComment } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
const TweetCard = ({tweet}) => {
  const [likes, setLikes] = useState(tweet.likes);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const navigate = useNavigate();
  useEffect(()=>{
    const liked = async () => {
        try {
            //Check if tweet is liked by user
            const likedStatus = await isLikedTweet(tweet._id);
            // console.log(likedStatus);
            setLiked(likedStatus.data.isLiked);

            // Check if tweet is disliked by user
            const storedDislikeStatus = localStorage.getItem(`disliked_${tweet._id}`);
            if (storedDislikeStatus === 'true') {
                setDisliked(true); // Set disliked state from localStorage
            }
        }
        catch(error){
            console.error('Error fetching liked tweet:', error);
        }
    }
    liked();
  }, [tweet._id]);
  const toggleLike = async () => {
    try {
      const response = await toggleTweetLike(tweet._id); // Make API call to toggle like/unlike
      let data = null;
      data = response.data; // API response containing message and data
      setLiked(!liked);  // Toggle the like state
      if (data) {
        setLikes(likes+1);  // Update like count if new like is created
        setLiked(!liked);  // Toggle the like state
        alert("Tweet liked successfully!");
      } else {
        setLikes(likes - 1);  // Decrease like count if video was unliked
        setLiked(false);  // Set liked state to false
        alert("Tweet unliked successfully!");
      }

      //Reset dislike state
      setDisliked(false);
      localStorage.removeItem(`disliked_${tweet._id}`);
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  } 
  const toggleDislike = async () => {
    try{
        if(liked){
            const response = await toggleTweetLike(tweet._id);
            let data = null;
            data = response.data;
            if(!data){
                setLikes(likes-1);
                setLiked(false);
            }
        }

        // Toggle dislike state and store it in localStorage
        setDisliked(!disliked);
        if(disliked){
            alert("Tweet undisliked successfully!");
        } else {
            alert("Tweet disliked successfully!");
        }
        localStorage.setItem(`disliked_${tweet._id}`, !disliked ? 'true' : 'false'); // Store dislike state in localStorage
    } catch(error){
        console.error('Error disliking tweet:', error);
    }
  }
  return (
    <div className="w-full rounded-xl border-[0.01rem] px-5 pt-5 pb-2 my-6 flex items-start gap-3 ">
    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
        <img src={tweet.owner.avatar} alt={tweet.owner.fullName} />
      </div>
      <div>
        <div className="flex items-center gap-3">
            <p>{tweet.owner.fullName}</p>
            <p>{tweet.createdAt ? formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true }) : 'Unknown'}</p>
        </div>
        <div>
            {tweet.content}
        </div>
        {tweet.image && <img src={tweet.image} alt={tweet.content} className="w-full rounded-xl mt-3"/>}
        <div className='flex items-center gap-4 mt-2'>
            <div className='flex items-center'>
                <button className='px-5 border-r-white flex items-center gap-2' onClick={toggleLike}>{!liked?<BiLike className='text-2xl'/>:<BiSolidLike className='text-2xl'/>}{likes}</button>
                <button className='' onClick={toggleDislike}>{!disliked?<BiDislike className='text-2xl'/>:<BiSolidDislike className='text-2xl'/>}</button>
            </div>
            <button className='text-2xl' onClick={()=>navigate(`/tweet/${tweet._id}`)}><MdOutlineComment /></button>
        </div>
      </div>
    </div>
  )
}

export default TweetCard