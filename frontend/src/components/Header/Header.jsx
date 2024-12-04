import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { logoutUser } from "../../utils/User.js";
import { useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { useForm } from "react-hook-form";

const Header = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) {
      setCurrentUser(user.data);
    }
  }, [user]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logoutUser();
    dispatch(logout());
    setMenuOpen(false); // Close the menu after logout
    setCurrentUser(null); // Clear the current user
  };

  const handleProfileClick = () => {
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
    <div className="flex items-center bg-gray-500/30 px-5 pb-4 pt-2 justify-between">
      <div className="flex items-center gap-5">
        <RxHamburgerMenu className="text-2xl" />
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
            <div className="absolute top-12 right-0 bg-white p-2 shadow-md rounded-md">
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
  );
};

export default Header;