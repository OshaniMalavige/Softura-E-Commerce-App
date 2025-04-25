"use client"
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import Header from "@/components/theme/Header.js";
import Footer from "@/components/theme/Footer.js";
import {useCart} from "@/app/context/CartContext.js";
import Button from "@/components/Button.js";

const ProductDetails = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id;
    const { addToCart } = useCart();
    const [product, setProduct] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`/api/products/${id}`);
            const data = await res.json();
            setProduct(data);
            setSelectedImage(`/uploads/${data.mainImage}`);
            // Set default selections
            if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
            if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => quantity > 1 && setQuantity(quantity - 1);

    const handleAddToCart = () => {
        const cartItem = {
            id: product._id,
            type: 'product',
            name: product.title,
            price: product.price,
            color: selectedColor || product.colors?.[0] || 'Default',
            size: selectedSize || product.sizes?.[0] || 'M',
            quantity,
            image: `/uploads/${product.mainImage}`,
        };
        addToCart(cartItem);
        router.push("/customer/cart");
    };

    return (
        <>
            <Header />
            <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Product Images */}
                <div>
                    {/* Main Image */}
                    <div className="relative w-full h-96 rounded-lg">
                        {selectedImage && (
                            <Image
                                src={selectedImage}
                                alt="Product"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg transition-all duration-300"
                            />
                        )}
                    </div>

                    {/* Sub-Images */}
                    <div className="mt-4 flex space-x-2">
                        {product.subImages?.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(`/uploads/${img}`)}
                                className="w-20 h-20 border rounded-lg hover:border-purple-500"
                            >
                                <Image
                                    src={`/uploads/${img}`}
                                    alt={`Sub Image ${index + 1}`}
                                    width={80}
                                    height={80}
                                    className="rounded-lg"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-2xl font-bold">{product.title}</h1>
                    <p className="text-lg text-gray-700 font-semibold mt-2">LKR {product.price}</p>

                    {/* Description */}
                    <ul className="mt-4 text-gray-700 list-disc list-inside">
                        {product.features?.map((line, index) => (
                            <li key={index}>{line}</li>
                        ))}
                    </ul>

                    {/* Colors */}
                    <div className="mt-4">
                        <h3 className="font-semibold">Colors</h3>
                        <div className="flex space-x-2 mt-2">
                            {product.colors?.map((color, index) => (
                                <button
                                    key={index}
                                    className={`w-6 h-6 rounded-full border ${selectedColor === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                ></button>
                            ))}
                        </div>
                    </div>

                   {/* Info Alert */}
                    <div className="flex items-center p-4 mb-4 mt-4 text-red-800 border-l-4 border-red-400 bg-red-50">
                        <div className="ms-3 text-sm font-medium text-justify">
                            PLEASE NOTE - The Image may be slightly different from the actual product in terms of color due to LIGHTING CONDITIONS or the display used to view. We hope you can seem to understand, it&#39;s beyond our ability to get the EXACT product color on the Image.
                        </div>
                    </div>

                    {/* Sizes */}
                    <div className="mt-4">
                        <h3 className="font-semibold">Size</h3>
                        <div className="flex space-x-2 mt-2">
                            {product.sizes?.map((size, index) => (
                                <button
                                    key={index}
                                    className={`px-3 py-1 border rounded hover:bg-gray-200 ${selectedSize === size ? 'bg-gray-200 font-medium' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center mt-6 gap-4">
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
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ProductDetails;