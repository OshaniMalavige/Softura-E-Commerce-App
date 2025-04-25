"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {FaClipboardList, FaUsers, FaBars, FaTimes, FaGifts, FaThList} from "react-icons/fa";
import notifications from "@/components/alerts/alerts.js";
import {PiListChecksFill} from "react-icons/pi";
import {BiSolidReport} from "react-icons/bi";
import {MdDashboard} from "react-icons/md";
import {FiLogOut} from "react-icons/fi";

const NavItem = ({ icon, label, href, isCollapsed }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`flex items-center space-x-2 p-2 rounded-md transition ${
                isActive ? "bg-[#B1BED5]" : "hover:bg-[#BCCCDC]"
            }`}
            title={isCollapsed ? label : ""}
        >
            <span className="text-lg">{icon}</span>
            {!isCollapsed && <span>{label}</span>}
        </Link>
    );
};

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setIsOpen(!isOpen);
        } else {
            setIsCollapsed(!isCollapsed);
        }
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
        <>
            {/* Mobile menu button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 bg-[var(--primaryHoverColor)] p-2 rounded-md text-white"
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar */}
            <div
                className={`bg-[#DBDFEA] text-[var(--primaryHoverColor)] ${isMobile ? 'fixed' : 'relative'} 
                    ${isMobile ? (isOpen ? 'w-64' : 'w-0') : (isCollapsed ? 'w-20' : 'w-64')} 
                    min-h-screen p-5 transition-all duration-300 z-40 overflow-hidden`}
            >
                <div className="flex items-center justify-between">
                    {(!isCollapsed || isMobile) && (
                        <Image
                            src="/assests/logo.png"
                            alt="Softura Logo"
                            width={isCollapsed && !isMobile ? 0 : 180}
                            height={15}
                            className={`${isCollapsed && !isMobile ? 'hidden' : 'block'}`}
                        />
                    )}
                </div>

                <nav className="space-y-4 mt-5 px-3 text-lg">
                    <NavItem
                        icon={<MdDashboard size={23}/>}
                        label="Dashboard"
                        href="/admin/dashboard"
                        isCollapsed={isCollapsed && !isMobile}
                    />
                    <NavItem
                        icon={<FaThList />}
                        label="Categories"
                        href="/admin/categories"
                        isCollapsed={isCollapsed && !isMobile}
                    />
                    <NavItem
                        icon={<FaClipboardList size={23}/>}
                        label="Products"
                        href="/admin/products"
                        isCollapsed={isCollapsed && !isMobile}
                    />
                    <NavItem
                        icon={<PiListChecksFill size={23}/>}
                        label="Orders"
                        href="/admin/orders"
                        isCollapsed={isCollapsed && !isMobile}
                    />
                    <NavItem
                        icon={<FaUsers size={23}/>}
                        label="Users"
                        href="/admin/users"
                        isCollapsed={isCollapsed && !isMobile}
                    />
                    <NavItem
                        icon={<FaGifts size={23}/>}
                        label="E Vouchers"
                        href="/admin/eVouchers"
                        isCollapsed={isCollapsed && !isMobile}
                    />
                    <NavItem
                        icon={<BiSolidReport size={23}/>}
                        label="Report"
                        href="/admin/report"
                        isCollapsed={isCollapsed && !isMobile}
                    />
                    <button
                        onClick={handleLogOut}
                        className={`flex items-center space-x-2 p-2 rounded-md transition hover:bg-[#BCCCDC] w-full text-left`}
                        title={isCollapsed ? "Sign Out" : ""}
                    >
                        <span className="text-lg"><FiLogOut /></span>
                        {!isCollapsed && <span>Sign Out</span>}
                    </button>
                </nav>
            </div>

            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;