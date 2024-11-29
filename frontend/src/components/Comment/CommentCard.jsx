import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { BiDislike, BiLike, BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import { isLikedComment, toggleCommentLike } from '../../utils/Like';
const CommentCard = ({comment}) => {
//   console.log(comment);
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  useEffect(()=>{
    const liked = async () => {
        try {
            //Check if comment is liked by user
            const likedStatus = await isLikedComment(comment._id);
            // console.log(likedStatus);
            setLiked(likedStatus.data.isLiked);

            // Check if comment is disliked by user
            const storedDislikeStatus = localStorage.getItem(`disliked_${comment._id}`);
            if (storedDislikeStatus === 'true') {
                setDisliked(true); // Set disliked state from localStorage
            }
        }
        catch(error){
            console.error('Error fetching liked comment:', error);
        }
    }
    liked();
  }, [comment._id]);
  const toggleLike = async () => {
    try {
      const response = await toggleCommentLike(comment._id); // Make API call to toggle like/unlike
      let data = null;
      data = response.data; // API response containing message and data
      setLiked(!liked);  // Toggle the like state
      if (data) {
        setLikes(likes+1);  // Update like count if new like is created
        setLiked(!liked);  // Toggle the like state
        alert("Comment liked successfully!");
      } else {
        setLikes(likes - 1);  // Decrease like count if video was unliked
        setLiked(false);  // Set liked state to false
        alert("Comment unliked successfully!");
      }

      //Reset dislike state
      setDisliked(false);
      localStorage.removeItem(`disliked_${comment._id}`);
    } catch (error) {
      console.error('Error liking tweet:', error);
    }
  } 
  const toggleDislike = async () => {
    try{
        if(liked){
            const response = await toggleCommentLike(comment._id);
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
            alert("Comment undisliked successfully!");
        } else {
            alert("Comment disliked successfully!");
        }
        localStorage.setItem(`disliked_${comment._id}`, !disliked ? 'true' : 'false'); // Store dislike state in localStorage
    } catch(error){
        console.error('Error disliking comment:', error);
    }
  }
  return (
    <div key={comment._id} className='flex gap-4 mt-5'>
        <div className='w-10 h-10 rounded-full overflow-hidden'>
            <img src={comment.owner?.avatar} alt={comment.owner?.avatar} />
        </div>
        <div>
            <div className='flex items-center gap-2'>
                <span className='capitalize'>{comment.owner?.username}</span>
                <span>{comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Unknown'}</span>
            </div>
            <p>{comment.content}</p>
            <div className='flex items-center'>
                <button className='pr-5 border-r-white flex items-center gap-2' onClick={toggleLike}>{!liked?<BiLike className='text-2xl'/>:<BiSolidLike className='text-2xl'/>}{likes}</button>
                <button className='' onClick={toggleDislike}>{!disliked?<BiDislike className='text-2xl'/>:<BiSolidDislike className='text-2xl'/>}</button>
            </div>
        </div>
    </div>
  )
}

export default CommentCard
