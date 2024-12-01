import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { BiDislike, BiLike, BiSolidLike, BiSolidDislike } from 'react-icons/bi';
import { isLikedComment, toggleCommentLike } from '../../utils/Like';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { deleteComment, updateComment } from '../../utils/Comment';

const CommentCard = ({ comment, deleteCommentHandler, updateCommentHandler }) => {
//   console.log(comment);
  const [likes, setLikes] = useState(comment.likes);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(comment.content);
  const currentUser = useSelector((state) => state.auth.user);
  const deletion = currentUser && currentUser.data.username === comment.owner?.username;
//   console.log(deletion);
//   console.log(currentUser);
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

  // Function to delete comment
  const deletingComment = async () => {
    try {
      await deleteComment(comment._id); // Make API call to delete comment
      deleteCommentHandler(comment._id); // Notify parent to update the comments
      alert("Comment deleted successfully!");
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  //Function to update comment
  const updatingComment = async () => {
    if (newContent.trim() === comment.content.trim()) {
        alert('No changes were made.');
        return;
    }
  
    if (newContent.trim() === '') {
        alert('Comment cannot be empty.');
        return;
    }
    // Placeholder for comment update logic (API call or state update)
    try {
        const response = await updateComment(comment._id, { content: newContent });
        console.log("Comment updated successfully:", response);
        updateCommentHandler(comment._id,newContent); // Notify parent to update the comments
        setIsEditing(false);
        alert("Comment updated successfully!");
    } catch (error) {
        console.error("Error updating comment:", error);
        alert("Failed to update comment. Please try again.");
    }
  };
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  return (
    <div className='flex items-start mt-5'>
        <div key={comment._id} className='flex gap-4 w-full'>
            <div className='w-10 h-10 rounded-full overflow-hidden'>
                <img src={comment.owner?.avatar} alt={comment.owner?.avatar} />
            </div>
            <div className='w-full'>
                <div className='flex items-center gap-2'>
                    <span className='capitalize'>{comment.owner?.username}</span>
                    <span>{comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Unknown'}</span>
                </div>
                {isEditing ? (
                    <div>
                        <input 
                            value={newContent}
                            onChange={e=>setNewContent(e.target.value)}
                            className='border-b p-2 rounded w-full bg-transparent outline-none'
                        />
                        <div className='flex gap-2 mt-2'>
                            <button onClick={updatingComment} className='bg-blue-500 text-white px-4 py-1 rounded'>Save</button>
                            <button onClick={()=>setIsEditing(false)} className='bg-gray-500 text-white px-4 py-1 rounded'>Cancel</button>
                        </div>
                    </div>
                ):(<p>{comment.content}</p>)}
                <div className='flex items-center'>
                    <button className='pr-5 border-r-white flex items-center gap-2' onClick={toggleLike}>{!liked?<BiLike className='text-2xl'/>:<BiSolidLike className='text-2xl'/>}{likes}</button>
                    <button className='' onClick={toggleDislike}>{!disliked?<BiDislike className='text-2xl'/>:<BiSolidDislike className='text-2xl'/>}</button>
                </div>
            </div>
        </div>
        <div className='relative'>
            <button onClick={toggleModal}><BsThreeDotsVertical /></button>
            {isModalOpen && <div className='absolute right-0 bg-white p-2 rounded-lg text-black'>
                {deletion && <div>
                    <button onClick={deletingComment}>Delete</button>
                    <button onClick={()=>(setIsEditing(true),setIsModalOpen(false))}>Edit</button>
                </div>}
                {!deletion && <button>Report</button>}
            </div>}
        </div>
    </div>
  )
}

export default CommentCard
