"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import {FaEye} from 'react-icons/fa';
import { useState } from "react";

const ProductCard = ({ id, image, title, price, status, colors = [] }) => {
    const router = useRouter();
    const [hovered, setHovered] = useState(false);

    // Define status colors
    const statusColors = {
        "New": "bg-blue-500",
        "Sold Out": "bg-red-500",
        "In Stock": "bg-green-500",
    };

    const handleNavigate = () => {
        router.push(`/product/${id}`);
    };

    return (
        <div
            className="bg-white shadow-lg rounded-lg p-4 w-96 relative overflow-hidden group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {status && (
                <span className={`px-2 py-1 text-sm text-white rounded absolute top-2 left-2 z-10 ${statusColors[status] || "bg-gray-500"}`}>
                    {status}
                </span>
            )}
            <div className="relative w-full h-52">
                <Image src={`/uploads/${image}`} alt={title} layout="fill" objectFit="cover" className="rounded-md" />
                {hovered && (
                    <button className="absolute top-2 right-2 z-10 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition" onClick={handleNavigate}>
                        <FaEye size={20} className="text-[var(--primaryColor)]" />
                    </button>
                )}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <div className="mt-2 flex items-center space-x-2">
                <span className="text-xl font-bold">${price}</span>
            </div>
            {colors.length > 0 && (
                <div className="mt-2 flex items-center space-x-2">
                    {colors.map((color, index) => (
                        <div
                            key={index}
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductCard;
