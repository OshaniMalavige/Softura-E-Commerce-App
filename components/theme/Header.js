"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiShoppingBag, FiUser } from "react-icons/fi";
import getUserData from "@/utils/getUserDataCookies.js";
import notifications from "@/components/alerts/alerts.js";
import Image from "next/image";
import Link from "next/link";
import {useCart} from "@/app/context/CartContext.js";

const Header = () => {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const user = getUserData();
    const userName = user?.username;
    const { cartItems } = useCart();
    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogOut = async () => {
        try {
            const res = await fetch('/api/logout', {
                method: 'POST',
            });

            if (res.ok) {
                router.push("/login");
            } else {
                notifications.error("Logout Failed");
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    return (
        <nav className="flex justify-between items-center py-4 px-6 bg-gray-50">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <Image
                    src="/assests/logo.png"
                    alt="Softura Logo"
                    width={180}
                    height={20}
                />
            </div>

            {/* Navigation Links */}
            <ul className="flex space-x-6">
                <li className="hover:text-[var(--navHoverColor)] cursor-pointer text-lg text-[var(--primaryColor)] font-bold">
                    <Link href="/newArrivals">New Arrivals</Link>
                </li>
                <li className="hover:text-[var(--navHoverColor)] cursor-pointer text-lg text-indigo-950 font-bold">
                    <Link href="/">Deals</Link>
                </li>
                <li className="hover:text-[var(--navHoverColor)] cursor-pointer text-lg text-[var(--primaryColor)] font-bold">
                    <Link href="/categories">Collections</Link>
                </li>
                <li className="hover:text-[var(--navHoverColor)] cursor-pointer text-lg text-[var(--primaryColor)] font-bold">
                    <Link href="/giftCards">Gift Cards</Link>
                </li>
                <li className="hover:text-[var(--navHoverColor)] cursor-pointer text-lg text-[var(--primaryColor)] font-bold">
                    <Link href="/contactus">Contact</Link>
                </li>
            </ul>

            {/* Icons */}
            <div className="flex items-center space-x-4 relative">
                {/* Cart Icon with Badge */}
                <div className="relative cursor-pointer" onClick={() => router.push("/customer/cart")}>
                    <FiShoppingBag className="text-black text-2xl cursor-pointer"/>
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 rounded-full">
                        {totalCartItems}
                    </span>
                </div>
                {userName && <span>{userName}</span>}

                {/* User Profile Section */}
                <div className="relative">
                    {userName ? (
                        <>
                            <Image
                                src="/assests/userProfile.png"
                                alt="User"
                                width={40}
                                height={40}
                                className="rounded-full cursor-pointer"
                                onClick={toggleDropdown}
                            />
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                                    <div className="px-4 py-2 text-black cursor-pointer"
                                         onClick={() => router.push("/profile")}>
                                        Profile
                                    </div>
                                    <div className="px-4 py-2 text-black cursor-pointer" onClick={handleLogOut}>
                                        Logout
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <FiUser
                            className="text-black text-2xl cursor-pointer"
                            onClick={() => router.push("/login")}
                        />
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;