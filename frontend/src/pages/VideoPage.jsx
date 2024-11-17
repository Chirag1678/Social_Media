import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ReactPlayer from 'react-player';
import { getVideoById } from '../utils/Video.js'; //  import the function

const VideoPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await getVideoById(videoId);
        setVideo(videoData.data);
      } catch (error) {
        console.error('Failed to load video:', error);
      }
    };

    fetchVideo();
  }, [videoId]);
  console.log(video);
  const owner = video?.video?.owner;
  console.log(owner);
  if (!video) return <div>Loading...</div>;

  return (
    <div className="video-page px-4 py-10">
      <ReactPlayer url={video.video.videoFile} height="70vh" width="75vw" controls />
      <h1 className='mb-2 capitalize'>{video.video.title}</h1>
      <div className='flex gap-3'>
        <div className='w-10 h-10 rounded-full bg-red-500 overflow-hidden'>
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
  );
};

export default VideoPage;