import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import ReactPlayer from 'react-player'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { CiBookmark, CiEdit, CiFlag1, CiSquareRemove } from "react-icons/ci";
import { useSelector } from 'react-redux';
import { addVideoToPlaylist, removeVideoFromPlaylist, getPlaylistById } from '../../utils/Playlist';
import { Button, Input, Select, TextArea } from '../index';
import { useForm } from 'react-hook-form';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

function VideoCard({ video, onDelete, onUpdate, onToggle }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
  const [VideoModalOpen, setVideoModalOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [isError, setIsError] = useState(false);
  const published = video.isPublished ===true;

  const playlistsData = useSelector((state) => state.playlist.playlists);
  const loggedInUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }  } = useForm();
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
  const toggleVideoModal = (event) => {
    if(event){
      event.stopPropagation();
    }
    setModalOpen(false);
    setVideoModalOpen(!VideoModalOpen);
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
      // console.log(playlistId);
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
  };
  const handleUpdateSubmit =async (data) => {
    if (!data.title && !data.description && !data.thumbnail?.length) {
      setIsError(true);
      return;
    }
    setIsError(false);

    await onUpdate(data,video._id);
    toggleVideoModal();
  };
  const handleDelete = async () => {
    await onDelete();
    setModalOpen(false);
  };
  const handleToggle = async () => {
    await onToggle();
    setModalOpen(false);
  }
  const [isPlaying, setIsPlaying] = useState(false);
  const channel = video.owner[0];
  const userChannel = channel._id === loggedInUser?.data._id;
  return (
    <>
    <div className="w-[30%] h-[35vh]" onClick={handleCardClick}>
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
          {modalOpen && <div className='absolute right-0 bg-slate-800 w-[20vw] rounded-xl text-white' onClick={e=>e.stopPropagation()}>
            <button className='m-5 flex items-center gap-3' onClick={togglePlaylistModal}><span><CiBookmark className='text-2xl'/></span>Save to playlist</button>
            <hr />
            <button className='m-5 flex items-center gap-3'><span><CiFlag1 className='text-2xl'/></span>Report</button>
            {userChannel && <><hr />
            <button className='m-5 flex items-center gap-3' onClick={toggleVideoModal}><span><CiEdit className='text-2xl'/></span>Edit</button>
            <hr />
            <button className='m-5 flex items-center gap-3' onClick={()=>handleDelete()}><span><CiSquareRemove className='text-2xl'/></span>Delete</button>
            <hr />
            <button className='m-5 flex items-center gap-3' onClick={()=>handleToggle()}><span>{published?<MdVisibilityOff className='text-2xl' />:<MdVisibility className='text-2xl'/>}</span>Make video {published?"Private":"Public"}</button>
            </>}
          </div>}
        </div>
      </div>
    </div>
    {playlistModalOpen && <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-[#71797E] rounded-xl p-5 flex flex-col items-start gap-5'>
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
    {VideoModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#71797E] rounded-3xl w-[70vw] h-[80vh]" onClick={e=>e.stopPropagation()}>
            <h2 className="text-xl font-semibold py-4 px-6">Update Video</h2>
            <hr />
            <h2 className="font-medium text-2xl mt-3 px-6">Details</h2>
            <div className="px-6">
              <form className="text-black" onSubmit={handleSubmit(handleUpdateSubmit)}>
                {/* Common Error Message */}
                {isError && (
                  <p className="text-red-500 text-sm font-bold">
                    At least one field must be updated. Please provide a title, description, thumbnail, or status.
                  </p>
                )}

                {/* Title Field */}
                <Input 
                  label="Title: " 
                  placeholder="Update title"
                  type="text" 
                  name="title" 
                  {...register("title")}
                />

                {/* Description Field */}
                <TextArea 
                  label="Description: " 
                  placeholder="Update description" 
                  name="description" 
                  {...register("description")}
                />
                <Input
                  label="Thumbnail: "
                  type="file" accept="image/*" name="thumbnail"
                  {...register("thumbnail")}
                />
                <Select label="Status: " defaultValue={published ?'public':'private'} {...register("status")}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </Select>
                <div className="flex justify-end gap-3 mt-2">
                  <Button bgColor="bg-gray-300" onClick={toggleVideoModal}>Cancel</Button>
                  <Button type="submit" bgColor="bg-blue-500">Update Video</Button>
                </div>
              </form>
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