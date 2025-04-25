"use client"

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from "next/image";
import Header from "@/components/theme/Header.js";
import ProductList from "@/app/(pages)/productList/page.js";
import {AiFillSafetyCertificate, AiFillTruck} from "react-icons/ai";
import {BiRecycle} from "react-icons/bi";
import {FaCircleDollarToSlot} from "react-icons/fa6";
import Footer from "@/components/theme/Footer.js";
import BestSelling from "@/app/(pages)/bestSelling/page.js";
import AllCategories from "@/app/(pages)/categories/page.js";
import CategoryGrid from "@/app/(pages)/customer/categoryGrid/page.js";

export default function MainHome() {
    const slides = [
        {
            id: 1,
            image: "/assests/slide1.png",
            alt: "Fashion Collection 1",
        },
        {
            id: 2,
            image: "/assests/slide2.png",
            alt: "Fashion Collection 2",
        },
        {
            id: 3,
            image: "/assests/slide3.png",
            alt: "Fashion Collection 3",
        }
    ];

    return (
        <>
            <Header/>
            {/* Hero */}
            <section className="w-full overflow-hidden my-12">
                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{ delay: 5000 }}
                    pagination={{ clickable: true }}
                    className="w-full"
                >
                    {slides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="w-full flex justify-center items-center bg-gray-100">
                                <Image
                                    src={slide.image}
                                    alt={slide.alt}
                                    width={1800}
                                    height={400}
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* Four Cards Section */}
            <section>
                <div className="grid grid-cols-4 gap-4 px-10 mt-8 mb-12">
                    <div className="bg-gray-600 rounded-sm">
                        <div className="flex items-center p-6">
                            <AiFillTruck className="w-10 h-10 rounded-full mr-4 text-green-600"/>
                            <div>
                                <p className="text-white text-xl">Free Shipping</p>
                                <p className="text-white text-md">Above $5 Only</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-600 rounded-sm">
                        <div className="flex items-center p-6">
                            <AiFillSafetyCertificate className="w-10 h-10 rounded-full mr-4 text-green-600"/>
                            <div>
                                <p className="text-white text-xl">Certified Organic</p>
                                <p className="text-white text-md">100% Guarantee</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-600 rounded-sm">
                        <div className="flex items-center p-6">
                            <FaCircleDollarToSlot className="w-10 h-10 rounded-full mr-4 text-green-600"/>
                            <div>
                                <p className="text-white text-xl">Huge Savings</p>
                                <p className="text-white text-md">At Lowest Price</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-600 rounded-sm">
                        <div className="flex items-center p-6">
                            <BiRecycle className="w-10 h-10 rounded-full mr-4 text-green-600"/>
                            <div>
                                <p className="text-white text-xl">Easy Returns</p>
                                <p className="text-white text-md">No Questions Asked</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section>
                <div className="p-8">
                    <h3 className="text-3xl font-bold text-[var(--primaryColor)] text-center">Categories</h3>
                    <p className="mt-3 text-md text-gray-600 text-center">
                        Create a WOW effect wherever you go with our range of designs. It&#39;s the perfect combination of comfort & sleek. Let&#39;s explore.
                    </p>
                </div>
                <CategoryGrid/>
            </section>

            {/* New Arrivals */}
            <section>
                <div className="p-8">
                    <h3 className="text-3xl font-bold text-[var(--primaryColor)] text-center">New Arrivals</h3>
                    <p className="mt-3 text-md text-gray-600 text-center">
                        Trendy uncommon products are available in Softura.
                    </p>
                </div>
                <ProductList filterStatus="New" />
            </section>

            {/* Best Selling */}
            <section>
                <BestSelling/>
            </section>

            {/* Subscribe To NewLetter */}
            <section>
                <div className="p-8 bg-[var(--secondaryBackground)] text-center">
                    <h3 className="text-xl font-bold text-[var(--headingColor)]">Subscribe To Us</h3>
                    <p className="mt-3 text-md text-gray-600 max-w-xl mx-auto">
                        We&#39;re ready to work together to get your products delivered on time. Subscribe to newsletters to receive emails and be the first to know about exclusive offers, new trends, promotions, and more.
                    </p>
                    <div className="max-w-xl mx-auto mt-4 text-left">
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 border rounded border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="px-6 py-2 bg-[var(--primaryColor)] text-white rounded-lg hover:bg-[var(--primaryHoverColor)] transition">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </>
    );
}