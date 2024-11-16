import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import ReactPlayer from 'react-player'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function VideoCard({ video }) {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/video/${video._id}`);
  }
  const [isPlaying, setIsPlaying] = useState(false);
  const channel = video.owner[0];
  return (
    <div className="w-[27%] h-[35vh]" onClick={handleCardClick}>
      <div className="w-full relative h-[70%] rounded-3xl overflow-hidden" onMouseEnter={() => setIsPlaying(true)} onMouseLeave={() => setIsPlaying(false)}>
        {!isPlaying && <img src={video.thumbnail} alt={video.title} className='absolute w-full h-full'/>}
        <ReactPlayer 
          url={video.videoFile} 
          width="100%" 
          height="100%" 
          controls={false}
          playing={isPlaying}
          muted={true}
        />
      </div>
      <div className="flex mt-4 gap-3">
        <div className="w-10 h-10 rounded-full bg-black overflow-hidden">
        <img src={channel.avatar} alt={`${channel.username}'s avatar`} />

        </div>
        <div className="leading-5">
            <h1 className="uppercase font-semibold pb-1">{video.title}</h1>
            <h2 className="capitalize">{channel.username}</h2>
            <div>
                <span>{video.views} views </span>
                <span>Uploaded {video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : 'Unknown'}</span>
            </div>
        </div>
      </div>
    </div>
  )
}

VideoCard.propTypes = {
  video: PropTypes.shape({
    owner: PropTypes.arrayOf(PropTypes.shape({
      avatar: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    })),
    title: PropTypes.string.isRequired,
    views: PropTypes.number.isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
};

export default VideoCard
