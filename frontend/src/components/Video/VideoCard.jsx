import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import ReactPlayer from 'react-player'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CiBookmark, CiFlag1 } from "react-icons/ci";
import { useSelector } from 'react-redux';
import { addVideoToPlaylist, removeVideoFromPlaylist, getPlaylistById } from '../../utils/Playlist';

function VideoCard({ video }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const playlistsData = useSelector((state) => state.playlist.playlists);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPlaylists = async () => {
      if(playlistsData){
        setPlaylists(playlistsData.playlists);

        const updatePlaylists = await Promise.all(
          playlistsData.playlists.map(async (playlist) => {
            try {
              const response = await getPlaylistById(playlist._id);
              const videos  = response.data.playlist[0].videos;
              // console.log(videos);
              const isVideoInPlaylist = videos.some((vid) => vid._id === video._id);
              // console.log(isVideoInPlaylist);
              return { ...playlist, checked: isVideoInPlaylist };
            }
            catch (error) {
              console.error('Failed to fetch playlist:', error);
              return { ...playlist, checked: false }
            }
          })
        );
        setPlaylists(updatePlaylists);
      }
    };
    fetchPlaylists();
  }, [playlistsData, video._id]);
  const handleCardClick = () => {
    navigate(`/video/${video._id}`);
  };
  const profileClick = (event) => {
    event.stopPropagation();
    navigate(`/c/${video.owner[0].username}`);
  }
  const toggleModal = (event) => {
    event.stopPropagation();
    setModalOpen(!modalOpen);
  }
  const togglePlaylistModal = (event) => {
    event.stopPropagation();
    setModalOpen(false);
    setPlaylistModalOpen(!playlistModalOpen);
  }
  const handleCheckboxChange =async (playlistId, isChecked) => {
    try {
      if(isChecked){
        await addVideoInPlaylist(playlistId);
      }
      else{
        await removeFromPlaylist(playlistId);
      }
      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist._id === playlistId ? { ...playlist, checked: isChecked } : playlist
        )
      );
    } catch (error) {
      console.error("Failed to update playlist:", error);
      alert("Failed to update playlist. Please try again.");
    }
  };
  const addVideoInPlaylist =async (playlistId) => {
    try {
      console.log(playlistId);
      const response =await addVideoToPlaylist(playlistId, video._id);
      console.log("Video added to playlist:", response);
      alert("Video added to playlist successfully!");
    } catch (error) {
      console.error('Failed to add video to playlist:', error);
      alert("Failed to add video to playlist. Please try again.");
    }
  }
  const removeFromPlaylist =async (playlistId) => {
    try {
      const response =await removeVideoFromPlaylist(playlistId, video._id);
      console.log("Video removed from playlist:", response);
      alert("Video removed from playlist successfully!");
    } catch (error) {
      console.error('Failed to remove video from playlist:', error);
      alert("Failed to remove video from playlist. Please try again.");
    }
  }
  const [isPlaying, setIsPlaying] = useState(false);
  const channel = video.owner[0];
  return (
    <>
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
      <div className='flex items-start mt-4 justify-between'>
        <div className="flex gap-3 w-full">
          <div className="w-10 h-10 rounded-full bg-black overflow-hidden cursor-pointer" onClick={profileClick}>
          <img src={channel.avatar} alt={`${channel.username}'s avatar`} />
          </div>
          <div className="leading-5">
            <h1 className="uppercase font-semibold pb-1">{video.title}</h1>
            <span className="capitalize cursor-pointer hover:text-gray-500" onClick={profileClick}>{channel.username}</span>
            <div>
                <span>{video.views} views </span>
                <span>Uploaded {video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : 'Unknown'}</span>
            </div>
          </div>
        </div>
        <div className='relative'>
          <button onClick={toggleModal}><BsThreeDotsVertical /></button>
          {modalOpen && <div className='absolute bg-slate-800 w-[20vw] rounded-xl text-white'>
            <button className='m-5 flex items-center gap-3' onClick={togglePlaylistModal}><span><CiBookmark className='text-2xl'/></span>Save to playlist</button>
            <hr />
            <h1 className='m-5 flex items-center gap-3'><span><CiFlag1 className='text-2xl'/></span>Report</h1>
          </div>}
        </div>
      </div>
    </div>
    {playlistModalOpen && <div className='absolute w-[99vw] h-[63vh] left-1/2 -translate-x-1/2 bg-black/40 flex items-center justify-center'>
      <div className='bg-slate-800 rounded-xl p-5 flex flex-col items-start gap-5'>
        <div className='flex items-center justify-between'>
          <h1 className='pr-5'>Add videos to...</h1>
          <button onClick={togglePlaylistModal}>X</button>
        </div>
        <div>
          {playlists && playlists.map((playlist) => (
            <div key={playlist._id} className='flex items-center gap-3'>
              {/* checkbox */}
              <input type="checkbox" id={playlist._id} name={playlist.name} value={playlist._id} checked={playlist.checked || false} onChange={(e)=>handleCheckboxChange(playlist._id, e.target.checked)}/>
              <p>{playlist.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>}
    </>
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