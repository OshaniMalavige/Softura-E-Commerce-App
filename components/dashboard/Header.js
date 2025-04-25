import {FaBell, FaSearch} from "react-icons/fa";
import getUserData from "@/utils/getUserDataCookies.js";
import Image from "next/image";

const Header = () => {
    const user = getUserData();

    return (
        <div className="flex items-center justify-between p-4 bg-[#F1EFEC]">
            <div className="relative w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full py-2 pl-4 pr-10 text-sm border rounded-md border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <FaSearch className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <FaBell className="w-6 h-6 text-[var(--primaryHoverColor)]" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <div className="flex items-center gap-2">
                    <Image
                        src="/assests/userProfile.png"
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <span className="font-medium">{user?.username}</span>
                </div>
            </div>
        </div>
    )
}
export default Header
