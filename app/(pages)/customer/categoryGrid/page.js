"use client"
import Image from 'next/image';
import {useEffect, useState} from "react";
import Link from "next/link";

export default function CategoryGrid() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllCategories();
    }, []);

    // Fetch categories from API
    const fetchAllCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-4 gap-6 p-6">
            {categories.map((category, index) => (
                <Link
                    key={index}
                    href={`/categoryProducts/${category._id}`}
                    className="border-gray-600 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-300"
                >
                    <div className="relative w-full h-72">
                        <Image src={`/uploads/${category.image}`} alt={category.name} layout="fill" objectFit="cover" />
                    </div>
                    <div className="p-4 text-center font-bold text-lg text-[var(--primaryHoverColor)]">{category.name}</div>
                </Link>
            ))}
        </div>
    );
}
