"use client"

import { useRouter } from "next/navigation";
import {
    FaArrowLeft,
    FaArrowRight,
    FaMinus,
    FaPlus,
    FaTrash
} from "react-icons/fa";
import {useCart} from "@/app/context/CartContext.js";
import Footer from "@/components/theme/Footer.js";
import Header from "@/components/theme/Header.js";
import notifications from "@/components/alerts/alerts.js";

export default function Cart() {
    const { cartItems, updateQuantity, removeItem } = useCart();
    const router = useRouter();

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const shipping = 200;
    const tax = 27.0;
    const discount = 0.0;
    const total = subtotal + shipping + tax - discount;

    const handleContinueShopping = () => {
        router.push(`/`);
    };

    const handleCheckout = async () => {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: cartItems.map(item => {
                        if (item.type === 'evoucher') {
                            return {
                                type: 'evoucher',
                                eVoucher: item.id,
                                quantity: item.quantity,
                                price: item.price,
                                senderName: item.senderName,
                                receiverName: item.receiverName,
                                note: item.note,
                                validDate: item.validDate
                            };
                        } else {
                            return {
                                type: 'product',
                                product: item.id,
                                quantity: item.quantity,
                                price: item.price,
                                selectedColor: item.color,
                                selectedSize: item.size
                            };
                        }
                    }),
                    totalAmount: total,
                    shippingMethod: "Standard Delivery",
                    shippingAddress: "Some default address"
                })
            });

            const result = await response.json();

            if (response.ok) {
                notifications.success("Order placed successfully!");
                router.push("/");
            } else {
                notifications.error(result.error || "Checkout failed.");
            }
        } catch (err) {
            notifications.error(err.message || "An error occurred during checkout.");
        }
    };

    return (
        <>
            <Header/>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6 border-t border-t-[var(--primaryColor)]">
            <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-2/3 bg-white rounded-lg shadow-sm">
                            <div className="border-b p-4">
                                <div className="grid grid-cols-12 text-sm font-medium text-gray-600">
                                    <div className="col-span-6">PRODUCT</div>
                                    <div className="col-span-2 text-center">PRICE</div>
                                    <div className="col-span-2 text-center">QUANTITY</div>
                                    <div className="col-span-2 text-right">TOTAL</div>
                                </div>
                            </div>
                            {cartItems.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    Your cart is empty.
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.id} className="border-b p-4">
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-6">
                                                <div className="flex gap-4">
                                                    <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{item.name}</p>
                                                        <div className="flex gap-2 mt-2 text-sm">
                                                            <div className="bg-gray-100 px-3 py-1 rounded-full">
                                                                Color: {item.color}
                                                            </div>
                                                            <div className="bg-gray-100 px-3 py-1 rounded-full">
                                                                Size: {item.size}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="flex items-center mt-3 text-gray-500 text-sm"
                                                        >
                                                            <FaTrash size={14} className="mr-1" /> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-center">
                                                <p className="font-medium">
                                                    LKR{item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="col-span-2 flex justify-center">
                                                <div className="flex items-center border rounded-md">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity - 1)
                                                        }
                                                        className="px-2 py-1 text-gray-600"
                                                    >
                                                        <FaMinus size={16} />
                                                    </button>
                                                    <span className="px-3 py-1">
                                                    {item.quantity}
                                                </span>
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity + 1)
                                                        }
                                                        className="px-2 py-1 text-gray-600"
                                                    >
                                                        <FaPlus size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-span-2 text-right font-medium">
                                                LKR{(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-medium border-b pb-4 mb-4">
                                    Order Summary
                                </h2>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">LKR{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="mb-4">
                                    <span className="text-gray-600">Shipping</span>
                                    <div className="mt-2 space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                className="mr-2"
                                                defaultChecked
                                            />
                                            <span className="flex-1">Standard Delivery - LKR200.00</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="shipping" className="mr-2" />
                                            <span className="flex-1">Express Delivery - LKR400.00</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name="shipping" className="mr-2" />
                                            <span className="flex-1">
                                            Free Shipping (Orders over LKR5000)
                                        </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">LKR{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-medium text-green-600">
                                    -LKR{discount.toFixed(2)}
                                </span>
                                </div>
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Total</span>
                                        <span className="text-xl font-medium text-[var(--primaryColor)]">
                                        LKR{total.toFixed(2)}
                                    </span>
                                    </div>
                                </div>
                                <button className="w-full bg-[var(--primaryColor)] text-white py-3 rounded-md mt-6 flex items-center justify-center cursor-pointer hover:bg-[var(--primaryHoverColor)]" onClick={handleCheckout}>
                                    Proceed to Checkout
                                    <FaArrowRight size={16} className="ml-2" />
                                </button>
                                <button className="w-full text-[var(--primaryColor)] py-3 mt-3 flex items-center justify-center cursor-pointer" onClick={handleContinueShopping}>
                                    <FaArrowLeft size={16} className="mr-2" /> Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}
