"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard.js";
import Header from "@/components/theme/Header.js";
import Footer from "@/components/theme/Footer.js";

const CategoryProducts = () => {
    const { id } = useParams();
    const [categoryName, setCategoryName] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                const res = await fetch(`/api/productCategory/${id}`);
                const data = await res.json();
                setCategoryName(data.categoryName || "Category");
                setProducts(data.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        if (id) fetchProductsByCategory();
    }, [id]);

    return (
        <>
            <Header/>
            <div className="p-8">
                <h3 className="text-3xl font-bold text-[var(--primaryColor)] text-center mb-6">
                    {categoryName}
                </h3>

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
            </div>
            <Footer/>
        </>
    );
};

export default CategoryProducts;
