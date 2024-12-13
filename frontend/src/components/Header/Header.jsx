import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { logoutUser } from "../../utils/User.js";
import { useNavigate, Outlet } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { useForm } from "react-hook-form";

const Header = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navBar, setNavBar] = useState(true);
  const [selectedPage, setSelectedPage] = useState('home');

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) {
      setCurrentUser(user.data);
    }
  }, [user]);

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
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center bg-gray-500/30 px-5 pb-4 pt-2 justify-between">
        <div className="flex items-center gap-5">
          <RxHamburgerMenu className="text-2xl cursor-pointer" onClick={toggleNavBar}/>
          <div onClick={() => navigate("/")} className="cursor-pointer">
            Logo
          </div>
        </div>
        <form className="flex items-center bg-black px-5 rounded-full" onSubmit={handleSubmit(searchByQuery)}>
        <input
          type="text"
          placeholder="Search"
          className="bg-black py-3 rounded-full w-[40vw] outline-none"
          name="query"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          {...register('query',{required:true})}
        />
        <button type="submit" className="bg-black text-2xl"><IoMdSearch /></button>
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
      <div className="flex flex-1">
        {navBar && (
          <div className="h-screen w-[20vw] bg-black fixed z-10 py-5 px-6">
            <div onClick={()=> {setSelectedPage('home'); navigate('/');}} className={`w-full flex cursor-pointer items-center gap-5 ${selectedPage === 'home' ? 'bg-gray-700' : ''} hover:bg-gray-700 py-2 px-3 rounded-xl mb-1`}>Home</div>
            <div onClick={()=> {setSelectedPage('subscriptions'); navigate('/subscribed');}} className={`w-full flex cursor-pointer items-center gap-5 ${selectedPage === 'subscriptions' ? 'bg-gray-700' : ''} hover:bg-gray-700 py-2 px-3 rounded-xl mb-1`}>Subscriptions</div>
            <hr />
            <div className="mt-3">You</div>
            <div onClick={()=> {setSelectedPage("history"); navigate('/history');}} className={`w-full flex cursor-pointer items-center gap-5 ${selectedPage==='history'?'bg-gray-700': ''} hover:bg-gray-700 py-2 px-3 rounded-xl mb-1`}>History</div>
            <div onClick={()=> {setSelectedPage("playlists"); navigate('/');}} className={`w-full flex cursor-pointer items-center gap-5 ${selectedPage==='playlists'?'bg-gray-700': ''} hover:bg-gray-700 py-2 px-3 rounded-xl mb-1`}>Playlists</div>
            <div onClick={()=> {setSelectedPage("your-videos"); navigate('/');}} className={`w-full flex cursor-pointer items-center gap-5 ${selectedPage==='your-videos'?'bg-gray-700': ''} hover:bg-gray-700 py-2 px-3 rounded-xl mb-1`}>Your videos</div>
            <div onClick={()=> {setSelectedPage("liked-videos"); navigate('/');}} className={`w-full flex cursor-pointer items-center gap-5 ${selectedPage==='liked-videos'?'bg-gray-700': ''} hover:bg-gray-700 py-2 px-3 rounded-xl mb-1`}>Liked videos</div>
            <hr />
          </div>
        )}
        <main className={`flex-1 ${navBar ? 'ml-[20vw]' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Header;