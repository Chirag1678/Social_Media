import { RxHamburgerMenu } from "react-icons/rx";
import { useSelector } from "react-redux";

const Header = () => {
    const currentUser = useSelector((state) => state.auth.user);
    console.log(currentUser.data.avatar);
  return (
    <div className="flex items-center bg-gray-500/30 px-5 pb-4 pt-2 justify-between">
        <div className="flex items-center gap-5">
            <RxHamburgerMenu className="text-2xl"/>
            <div>Logo</div>
        </div>
        <input type="text" placeholder="Search" className="bg-black p-3 px-5 rounded-full w-[40vw] outline-none"/>
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
            <img src={currentUser.data.avatar} alt="" />
        </div>
    </div>
  )
}

export default Header
