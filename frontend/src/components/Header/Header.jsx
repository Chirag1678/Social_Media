import { useState, useEffect, createElement } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { logoutUser } from "../../utils/User.js";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { GoHomeFill, GoVideo } from "react-icons/go";
import { useForm } from "react-hook-form";
import { FaYoutube } from "react-icons/fa";
import { MdHistory, MdOutlinePlaylistPlay, MdOutlineSubscriptions } from "react-icons/md";
import { BiLike } from "react-icons/bi";

const Header = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navBar, setNavBar] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');
  const pages = [
    {
      page: 'Home',
      link: '/',
      Icon: 'GoHomeFill'
    },
    {
      page: 'Subscriptions',
      link: '/subscribed',
      Icon: 'MdOutlineSubscriptions'
    },
    {
      page: 'History',
      link: '/history',
      Icon: 'MdHistory'
    },
    {
      page: 'Playlists',
      link: '/',
      Icon: 'MdOutlinePlaylistPlay'
    },
    {
      page: 'Your Videos',
      link: '/',
      Icon: 'GoVideo'
    },
    {
      page: 'Liked Videos',
      link: '/liked',
      Icon: 'BiLike'
    }
  ];

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) {
      setCurrentUser(user.data);
    }

    // Get the current URL during load
    const currentUrl = location.pathname;

    // Set selectedPage based on the current pathname
    setSelectedPage(
      currentUrl === "/"
        ? "home"
        : currentUrl === "/subscribed"
        ? "subscriptions"
        : currentUrl === "/history"
        ? "history"
        : currentUrl === "/playlists"
        ? "playlists"
        : currentUrl === "/liked"
        ? "liked-videos"
        : "your-videos"
    );
  }, [user, location.pathname]);

  useEffect(() => {
    const currentUrl = location.pathname;
    const isVideoPage = currentUrl.startsWith("/video/") && currentUrl.split('/').length===3;
    setNavBar(!isVideoPage);
  }, [location.pathname]);
  
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleNavBar = () => {
    setNavBar((prev) => !prev);
  };

  const handleLogout = () => {
    logoutUser();
    dispatch(logout());
    setMenuOpen(false); // Close the menu after logout
    setCurrentUser(null); // Clear the current user
  };

  const handleProfileClick = () => {
    setMenuOpen(false);
    navigate(`/c/${currentUser.username}`); // Navigate to the profile page
  };

  const handleLogin = () => {
    navigate("/login"); // Navigate to the login page
  };

  const handleSignup = () => {
    navigate("/signup"); // Navigate to the signup page
  };

  const searchByQuery = (data) => {
    // console.log(data);
    navigate(`/search?query=${encodeURIComponent(data.query)}`);
    reset();
  }
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="fixed w-full z-10 flex items-center bg-[#212121] px-5 pb-4 pt-2 justify-between">
        <div className="flex items-center gap-5">
          <RxHamburgerMenu className="text-2xl cursor-pointer" onClick={toggleNavBar}/>
          <div onClick={()=> {setSelectedPage('home'); navigate('/');}} className="cursor-pointer flex items-center gap-x-3">
            <FaYoutube className="text-red-500 text-3xl"/>
            <h1 className="text-xl font-semibold">WatchBuddy</h1>
          </div>
        </div>
        <form className="flex items-center bg-black pl-5 w-[40vw] rounded-full overflow-hidden" onSubmit={handleSubmit(searchByQuery)}>
        <input
          type="text"
          placeholder="Search"
          className="bg-black py-3 rounded-full w-full outline-none"
          name="query"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          {...register('query',{required:true})}
        />
        <button type="submit" className="bg-[#303030] text-2xl py-3 px-5"><IoMdSearch /></button>
        </form>
        {currentUser ? (
          // Logged-in view
          <div className="flex items-center gap-5">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src={currentUser.avatar}
                alt={`${currentUser.username}'s avatar`}
                onClick={toggleMenu}
                className="cursor-pointer"
              />
            </div>
            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute top-12 right-0 bg-white p-2 shadow-md rounded-md z-50">
                <button
                  onClick={handleProfileClick}
                  className="block px-4 py-2 text-black w-full text-left"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-black w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Logged-out view
          <div className="flex gap-5">
            <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
              Login
            </button>
            <button onClick={handleSignup} className="bg-green-500 text-white px-4 py-2 rounded">
              Sign Up
            </button>
          </div>
        )}
      </div>
      <div className="flex">
        {navBar && (
          <div className="h-screen w-[16vw] bg-[#212121] fixed top-[4.5rem] z-10 py-2">
            {/* <div onClick={()=> {setSelectedPage('home'); navigate('/');}} className={`w-full flex text-lg cursor-pointer items-center gap-x-5 ${selectedPage === 'home' ? 'bg-[#303030]' : ''} hover:bg-[#303030] py-2 px-7 rounded-lg`}>
              <GoHomeFill className="text-2xl"/>
              Home
            </div> */}
            {pages.map((data,index)=>(
              <div key={index}>
                <div onClick={()=>{setSelectedPage(data.page.trim().toLowerCase().split(" ").join("-")); navigate(data.link)}} className={`w-full flex text-lg cursor-pointer items-center gap-x-5 ${selectedPage === data.page.trim().toLowerCase().split(" ").join("-")? 'bg-[#303030]': ''} hover:bg-[#303030] py-2 px-7 rounded-lg`}>
                  {createElement({
                    GoHomeFill,
                    MdOutlineSubscriptions,
                    MdHistory,
                    MdOutlinePlaylistPlay,
                    GoVideo,
                    BiLike
                  }[data.Icon] || GoHomeFill,
                  {className: "text-2xl"})}
                  {data.page}
                </div>
                {index === 1 && (<>
                  <hr className="mt-3"/>
                  <div className="mt-3 px-7 text-lg hover:bg-[#303030] py-2 rounded-lg">You</div>
                </>
                )}
                {index === 5 && <hr className="mt-3"/>}
              </div>
            ))}
            {/* <div onClick={()=> {setSelectedPage('subscriptions'); navigate('/subscribed');}} className={`w-full flex cursor-pointer items-center gap-5 ${selectedPage === 'subscriptions' ? 'bg-[#303030]' : ''} hover:bg-[#303030] py-2 px-3 rounded-xl mb-1`}>
              <MdOutlineSubscriptions />
              Subscriptions
            </div>
            <hr />
            <div className="mt-3">You</div>
            <div onClick={()=> {setSelectedPage("history"); navigate('/history');}} className={`w-full flex cursor-pointer items-center gap-5 ${selectedPage==='history'?'bg-[#303030]': ''} hover:bg-[#303030] py-2 px-3 rounded-xl mb-1`}>History</div>
            <div onClick={()=> {setSelectedPage("playlists"); navigate('/');}} className={`w-full flex cursor-pointer items-center gap-5 ${selectedPage==='playlists'?'bg-[#303030]': ''} hover:bg-[#303030] py-2 px-3 rounded-xl mb-1`}>Playlists</div>
            <div onClick={()=> {setSelectedPage("your-videos"); navigate('/');}} className={`w-full flex cursor-pointer items-center gap-5 ${selectedPage==='your-videos'?'bg-[#303030]': ''} hover:bg-[#303030] py-2 px-3 rounded-xl mb-1`}>Your videos</div>
            <div onClick={()=> {setSelectedPage("liked-videos"); navigate('/liked');}} className={`w-full flex cursor-pointer items-center gap-5 ${selectedPage==='liked-videos'?'bg-[#303030]': ''} hover:bg-[#303030] py-2 px-3 rounded-xl mb-1`}>Liked videos</div>
            <hr /> */}
          </div>
        )}
        <main className={`flex-1 ${navBar ? 'ml-[16vw]' : ''} mt-12`}>
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Header;