import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import { isLikedTweet, toggleTweetLike } from '../../utils/Like';
import { MdOutlineComment } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CiEdit, CiFlag1, CiSquareRemove } from 'react-icons/ci';
import { useForm } from 'react-hook-form';
import { Button, Input } from '../index';
import { useSelector } from 'react-redux';
const TweetCard = ({tweet, onDelete, onUpdate}) => {
  const [likes, setLikes] = useState(tweet.likes);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tweetModalOpen, setTweetModalOpen] = useState(false);
  const [isError, setIsError] = useState(false);

  const loggedInUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }  } = useForm();
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
  const handleDelete = async () => {
    await onDelete();
    setModalOpen(false);
  }
  const toggleTweetModal = () => {
    setModalOpen(false);
    setTweetModalOpen(!tweetModalOpen);
  }
  const handleUpdate = async (data) => {
    if(!data.content && !data.image?.length){
      setIsError(true);
      return;
    }
    setIsError(false);

    await onUpdate(data,tweet._id);
    toggleTweetModal();
  };

  const channel = tweet.owner;
  const userChannel = channel._id === loggedInUser?.data._id;
  return (
    <>
    <div className="rounded-xl border-[0.01rem] px-5 pt-5 pb-2 my-6 flex items-start justify-between w-full">
      <div className='flex items-start gap-8 w-full'>
        <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
          <img src={tweet.owner.avatar} alt={tweet.owner.fullName}/>
        </div>
        <div className='w-full'>
          <div className="flex items-center gap-3">
              <p>{tweet.owner.fullName}</p>
              <p>{tweet.createdAt ? formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true }) : 'Unknown'}</p>
          </div>
          <div>
              {tweet.content}
          </div>
          {tweet.image && <img src={tweet.image} alt={tweet.content} className="rounded-xl mt-3"/>}
          <div className='flex items-center gap-4 mt-2'>
              <div className='flex items-center'>
                  <button className='px-5 border-r-white flex items-center gap-2' onClick={toggleLike}>{!liked?<BiLike className='text-2xl'/>:<BiSolidLike className='text-2xl'/>}{likes}</button>
                  <button className='' onClick={toggleDislike}>{!disliked?<BiDislike className='text-2xl'/>:<BiSolidDislike className='text-2xl'/>}</button>
              </div>
              <button className='text-2xl' onClick={()=>navigate(`/tweet/${tweet._id}`)}><MdOutlineComment /></button>
          </div>
        </div>
      </div>
      <div className='relative'>
        <button><BsThreeDotsVertical onClick={()=>setModalOpen(!modalOpen)} className='text-2xl'/></button>
        {modalOpen && <div className='absolute bg-slate-800 right-0 w-[20vw] rounded-xl text-white'>
          <button className='m-5 flex items-center gap-3'><span><CiFlag1 className='text-2xl'/></span>Report</button>
          {userChannel && <><hr />
          <button onClick={toggleTweetModal} className='m-5 flex items-center gap-3'><span><CiEdit className='text-2xl'/></span>Edit</button>
          <hr />
          <button onClick={()=>handleDelete()} className='m-5 flex items-center gap-3'><span><CiSquareRemove className='text-2xl'/></span>Delete</button></>}
        </div>}
      </div>
    </div>
    {tweetModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#71797E] rounded-3xl w-[70vw] h-[80vh]">
        <h2 className="text-xl font-semibold py-4 px-6">Update Tweet</h2>
        <hr />
        <h2 className="font-medium text-2xl mt-3 px-6">Details</h2>
        <div className="px-6">
          <form onSubmit={handleSubmit(handleUpdate)}>
            {/* Common Error Message */}
            {isError && (
              <p className="text-red-500 text-sm font-bold">
                At least one field must be updated. Please provide at least one of the content or image.
              </p>
            )}
            <Input label="Content: " placeholder="Enter your tweet" type="text" name="content" {...register("content", {value: tweet.content})}/>
            <Input label="Image: " placeholder="Enter your image" type="file" name="image" {...register("image")}/>
            <div className="flex justify-end gap-3 mt-2">
              <Button bgColor="bg-gray-300" onClick={toggleTweetModal}>Cancel</Button>
              <Button type="submit" bgColor="bg-blue-500">Update Tweet</Button>
            </div>
          </form>
        </div>
      </div>
    </div>}
    </>
  )
}

export default TweetCard