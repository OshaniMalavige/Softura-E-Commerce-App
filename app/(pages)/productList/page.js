"use client"
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard.js";

const ProductList = ({ filterStatus }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products"); // Adjust endpoint if needed
                const data = await res.json();
                const filtered = filterStatus
                    ? data.filter(product => product.status === filterStatus)
                    : data;
                setProducts(filtered);
            } catch (error) {
                console.error("Failed to load products:", error);
            }
        };

        fetchProducts();
    }, [filterStatus]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-10">
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    id={product._id}
                    image={product.mainImage}
                    title={product.title}
                    price={product.price}
                    status={product.status}
                    colors={product.colors}
                />
            ))}
        </div>
    );
};

export default ProductList;
