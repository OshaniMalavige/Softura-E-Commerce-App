import Link from "next/link";
import {FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube} from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="w-full bg-gray-50">
            <div className="mx-auto p-8">
                <div className="py-7 border-t border-gray-200">
                    <div className="flex items-center justify-center flex-col lg:justify-between lg:flex-row">
                        <span className="text-sm text-[var(--primaryColor)]">
                            ©<Link href="/">softura</Link> 2025, All rights reserved.
                        </span>
                        <div className="flex mt-4 space-x-4 sm:justify-center lg:mt-0">
                            <Link
                                href="/"
                                className="w-9 h-9 rounded-full bg-[var(--primaryColor)] flex justify-center items-center hover:bg-[var(--primaryHoverColor)]"
                            >
                                <FaTwitter className="text-white text-lg" />
                            </Link>
                            <Link
                                href="/"
                                className="w-9 h-9 rounded-full bg-[var(--primaryColor)] flex justify-center items-center hover:bg-[var(--primaryHoverColor)]"
                            >
                                <FaInstagram className="text-white text-lg" />
                            </Link>
                            <Link
                                href="/"
                                className="w-9 h-9 rounded-full bg-[var(--primaryColor)] flex justify-center items-center hover:bg-[var(--primaryHoverColor)]"
                            >
                                <FaLinkedinIn className="text-white text-lg" />
                            </Link>
                            <Link
                                href="/"
                                className="w-9 h-9 rounded-full bg-[var(--primaryColor)] flex justify-center items-center hover:bg-[var(--primaryHoverColor)]"
                            >
                                <FaYoutube className="text-white text-lg" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
