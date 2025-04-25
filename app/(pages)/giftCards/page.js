"use client"

import {useEffect, useState} from "react";
import Header from "@/components/theme/Header.js";
import Image from "next/image";
import Link from "next/link";

export default function EVouchers() {
    const [EVouchers, setEVouchers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEVouchers();
    }, []);

    const fetchEVouchers = async () => {
        try {
            const res = await fetch("/api/eVoucher");
            const data = await res.json();
            setEVouchers(data);
        } catch (error) {
            console.error("Error fetching EVouchers:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <Header />
            <div className="p-8">
                <h3 className="text-3xl font-bold text-[var(--primaryColor)] text-center">E-Vouchers</h3>
                <p className="mt-3 text-md text-gray-600 text-center">
                    Latest fashion trends for women in Sri Lanka. Enjoy the just-dropped outfits at Softura. Explore the existing collection of dresses, tops, casuals, etc.
                </p>

                <div className="grid grid-cols-3 gap-6 mt-10">
                    {EVouchers.map((voucher) => (
                        <div key={voucher._id} className="relative group rounded-lg overflow-hidden p-8">
                            <Image
                                src={`/uploads/${voucher.eImage}`}
                                alt="EVoucher"
                                width={150}
                                height={150}
                                className="object-cover w-full h-full"
                            />

                            {/* Transparent Hover Overlay */}
                            <div className="absolute inset-0 bg-opacity-30 group-hover:bg-opacity-60 transition duration-300 ease-in-out flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <Link href={`/eVoucherDetails/${voucher._id}`}>
                                <button className="px-4 py-2 bg-white text-[var(--primaryColor)] font-semibold rounded hover:bg-[var(--primaryColor)] hover:text-white transition">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
