import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice.js";
import { logoutUser } from "../../utils/User.js";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const user = useSelector((state) => state.auth.user);
    useEffect(() => {
        if(user) {
            setCurrentUser(user.data);
        }
    }, [user]);
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // console.log(currentUser.avatar);
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };
    const handleLogout = () => {
        logoutUser();
        dispatch(logout());
        setMenuOpen(false);  // Close the menu after logout
    };
    const handleProfileClick = () => {
        navigate(`/c/${currentUser.username}`);  // Add navigation to profile page here
    };
    const handleLogin = () => {
        navigate("/login");  // Navigate to the login page
    };
    // console.log(currentUser);
  return (
    <div className="flex items-center bg-gray-500/30 px-5 pb-4 pt-2 justify-between">
        <div className="flex items-center gap-5">
            <RxHamburgerMenu className="text-2xl"/>
            <div onClick={()=>navigate("/")} className="cursor-pointer">Logo</div>
        </div>
        <input type="text" placeholder="Search" className="bg-black p-3 px-5 rounded-full w-[40vw] outline-none"/>
        {currentUser ? (
            <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={currentUser.avatar} alt={`${currentUser.username}'s avatar`} onClick={toggleMenu} className="cursor-pointer"/>
                </div>
                {/* Dropdown Menu */}
                {menuOpen && (
                    <div className="absolute top-12 right-0 bg-white p-2 shadow-md rounded-md">
                        <button onClick={handleProfileClick} className="block px-4 py-2 text-black w-full text-left">Profile</button>
                        <button onClick={handleLogout} className="block px-4 py-2 text-black w-full text-left">Logout</button>
                    </div>
                )}
            </div>
        ) : (
            <div className="flex gap-5">
                <button onClick={handleLogin}>Login</button>
                <button>Sign Up</button>
            </div>
        )}
    </div>
  )
}

export default Header
