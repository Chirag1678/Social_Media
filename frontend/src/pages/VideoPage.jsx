import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ReactPlayer from 'react-player';
import { getVideoById } from '../utils/Video.js'; //  import the function
import { getCommentsById } from '../utils/Comment.js'; //  import the function

const VideoPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await getVideoById(videoId);
        const commentsData = await getCommentsById(videoId);
        setVideo(videoData.data);
        setComments(commentsData.data);
      } catch (error) {
        console.error('Failed to load video:', error);
      }
    };
    fetchVideo();
  }, [videoId]);
  // console.log(video);
  const owner = video?.video?.owner;
  // console.log(owner);
//   console.log(comments.docs);
  if (!video) return <div>Loading...</div>;

  return (
    <div className="video-page px-4 py-10 min-h-screen bg-black">
      <div>
      <ReactPlayer url={video.video.videoFile} height="70vh" width="75vw" controls playing/>
      <h1 className='mb-2 capitalize'>{video.video.title}</h1>
      <div className='flex gap-3'>
        <div className='w-10 h-10 rounded-full overflow-hidden'>
            <img src={owner.avatar} alt={`${owner.username}'s avatar`} />
        </div>
        <div className='leading-4'>
            <h1 className='mb-1 capitalize'>{owner.username}</h1>
            <h2>{} subscribers</h2>
        </div>
        <div></div>
      </div>
      <p>{video.video.description}</p>
      <p>
      <span>{video.video.views} views </span>
      <span>{video.video.createdAt ? formatDistanceToNow(new Date(video.video.createdAt), { addSuffix: true }) : 'Unknown'}</span>
      </p>
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
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPage;