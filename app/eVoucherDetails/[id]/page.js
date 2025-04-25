"use client"

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import {useCart} from "@/app/context/CartContext.js";
import Input from "@/components/Input.js";
import Button from "@/components/Button.js";
import {FaCircle} from "react-icons/fa";

const EVoucherDetails = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const { addToCart } = useCart();
    const [voucher, setVoucher] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [openAccordion, setOpenAccordion] = useState(0);

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const accordionItems = [
        {
            id: 1,
            title: "Product Information",
            content: (
                <>
                    <p className="mb-2 text-gray-500">Gift cards can be redeemed online. Gift cards are valid for 1(one) year. Full Terms & Conditions here.</p>
                </>
            )
        },
        {
            id: 2,
            title: "Term of Use",
            content: (
                <>
                    <ul className="list-disc list-inside text-gray-500 space-y-2">
                        <li>This Voucher is valid for a period of 1 year from the date of issue.</li>
                        <li>Can be redeemed via shops & online.</li>
                        <li>Not valid during any sale or in conjunction with special promotions.</li>
                        <li>Company is not responsible if the voucher is damaged/lost/stolen or destroyed, no replacement will be provided.</li>
                        <li>The receiver needs to show us the stated voucher code through a picture to redeem it.</li>
                    </ul>
                </>
            )
        }
    ];

    useEffect(() => {
        fetchEvouchers();
    }, []);

    const fetchEvouchers = async () => {
        try {
            const res = await fetch(`/api/eVoucher/${id}`);
            const data = await res.json();
            setVoucher(data);
            setSelectedImage(`/uploads/${data.eImage}`);
        } catch (error) {
            console.error("Error fetching voucher:", error);
        }
    };

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

    const handleAddToCart = () => {
        const cartItem = {
            id: voucher._id,
            type: 'evoucher',
            name: voucher.code,
            price: voucher.amount,
            quantity,
            image: `/uploads/${voucher.eImage}`,
        };
        addToCart(cartItem);
        router.push("/customer/cart");
    };

    return (
        <>
            <div className="bg-white py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row -mx-4">
                        <div className="md:flex-1 px-4">
                            <div className="h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4">
                                {selectedImage && (
                                    <Image
                                        className="w-full h-full object-cover"
                                        src={selectedImage}
                                        width={960}
                                        height={720}
                                        alt="Evoucher Image"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="md:flex-1 px-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">E-VOUCHER</h2>
                            <p className="font-bold text-gray-700 text-lg mb-4">LKR{voucher.amount}.00</p>
                            <div className="flex mb-4">
                                <div className="mr-4">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Availability:</span>
                                    <span className="text-gray-600 dark:text-gray-300">In Stock</span>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Code:</span>
                                    <span className="text-gray-600 dark:text-gray-300"> {voucher.code}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <Input
                                    label="Sender Name"
                                    type="text"
                                />
                                <Input
                                    label="Receiever Name"
                                    type="text"
                                />
                                <label className="block font-medium text-gray-700">
                                    Note
                                </label>
                                <textarea
                                    name="note"
                                    rows={3}
                                    className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-950"
                                    defaultValue={''}
                                />
                            </div>
                            <div className="flex items-center mt-6 gap-4 mb-4">
                                <div className="flex items-center border rounded-md">
                                    <button
                                        className="px-3 py-2 hover:bg-gray-100 transition"
                                        onClick={decreaseQuantity}
                                    >
                                        -
                                    </button>
                                    <span className="mx-3 text-lg w-8 text-center">{quantity}</span>
                                    <button
                                        className="px-3 py-2 hover:bg-gray-100 transition"
                                        onClick={increaseQuantity}
                                    >
                                        +
                                    </button>
                                </div>
                                <Button
                                    className="flex-1 py-3"
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </Button>
                            </div>
                            <div id="accordion-flush" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                                {accordionItems.map((item) => (
                                    <div key={item.id}>
                                        <h2 id={`accordion-flush-heading-${item.id}`}>
                                            <button
                                                type="button"
                                                className={`flex items-center justify-between w-full py-5 font-medium rtl:text-right border-b border-gray-200 dark:border-gray-700 gap-3 ${
                                                    openAccordion === item.id
                                                        ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                                        : "text-gray-500 dark:text-gray-400"
                                                }`}
                                                onClick={() => toggleAccordion(item.id)}
                                                aria-expanded={openAccordion === item.id}
                                                aria-controls={`accordion-flush-body-${item.id}`}
                                            >
                                                <span>{item.title}</span>
                                                <svg
                                                    className={`w-3 h-3 shrink-0 ${openAccordion === item.id ? "rotate-180" : ""}`}
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 10 6"
                                                >
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5"/>
                                                </svg>
                                            </button>
                                        </h2>
                                        <div
                                            id={`accordion-flush-body-${item.id}`}
                                            className={`${openAccordion === item.id ? "block" : "hidden"}`}
                                            aria-labelledby={`accordion-flush-heading-${item.id}`}
                                        >
                                            <div className="py-5 border-b border-gray-200 dark:border-gray-700">
                                                {item.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EVoucherDetails;