"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout.js";
import DataTable from "@/components/DataTable.js";
import { FaEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import Modal from "@/components/Modal.js";
import notifications from "@/components/alerts/alerts.js";
import ConfirmationModal from "@/components/ConfirmationModal.js";
import SkeletonTable from "@/components/SkeletonTable.js";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProductAddModal, setShowProductAddModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showEditProductModal, setShowEditProductModal] = useState(false);
    const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({
        title: "",
        category: "",
        price: "",
        discountedPrice: "",
        mainImage: null,
        subImages: [],
        features: "",
        colors: [],
        sizes: [],
        status: "",
        stock: "",
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleAddProduct = async () => {
        try{
            const productData = new FormData();
            productData.append("title", newProduct.title);
            productData.append("category", newProduct.category || "");
            productData.append("price", newProduct.price || "");
            productData.append("discountedPrice", newProduct.discountedPrice || 0);
            productData.append("features", newProduct.features || "");
            if (newProduct.mainImage) {
                productData.append("mainImage", newProduct.mainImage);
            }

            // Adding sub images
            if (newProduct.subImages && newProduct.subImages.length > 0) {
                newProduct.subImages.forEach((file) => {
                    productData.append("subImages", file);
                });
            }

            // Adding colors
            if (newProduct.colors && newProduct.colors.length > 0) {
                newProduct.colors.forEach((color) => {
                    productData.append("colors", color);
                });
            }

            // Adding sizes
            if (newProduct.sizes && newProduct.sizes.length > 0) {
                newProduct.sizes.forEach((size) => {
                    productData.append("sizes", size);
                });
            }
            productData.append("status", newProduct.status || "");
            productData.append("stock", newProduct.stock || "");

            const res = await fetch("/api/products", {
                method: "POST",
                body: productData,
            });

            const data = await res.json();

            if (res.ok) {
                notifications.success(data.message);
                setNewProduct({
                    title: "",
                    category: "",
                    price: "",
                    discountedPrice: "",
                    mainImage: null,
                    subImages: [],
                    features: "",
                    colors: [],
                    sizes: [],
                    status: "",
                    stock: "",
                });
                setShowProductAddModal(false);
                fetchProducts();
            } else {
                notifications.error(data.message);
            }
        }catch (error) {
            console.error("Error adding product:", error);
        }
    }

    const handleInputChange = (field, value) => {
        setNewProduct((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditInputChange = (field, value) => {
        setSelectedProduct((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdateProduct = async () => {
        if (!selectedProduct) return;

        try {
            const productData = new FormData();
            productData.append("title", selectedProduct.title);
            const categoryId = selectedProduct.category?._id || selectedProduct.category;
            productData.append("category", categoryId);
            productData.append("price", Number(selectedProduct.price));
            productData.append("discountedPrice", selectedProduct.discountedPrice || 0);
            productData.append("features", selectedProduct.features || "");

            if (selectedProduct.mainImage && selectedProduct.mainImage instanceof File) {
                productData.append("mainImage", selectedProduct.mainImage);
            }

            // Adding colors
            if (selectedProduct.colors && selectedProduct.colors.length > 0) {
                selectedProduct.colors.forEach((color) => {
                    productData.append("colors", color);
                });
            }

            // Adding sizes
            if (selectedProduct.sizes && selectedProduct.sizes.length > 0) {
                selectedProduct.sizes.forEach((size) => {
                    productData.append("sizes", size);
                });
            }
            productData.append("status", selectedProduct.status || "");
            productData.append("stock", selectedProduct.stock || "");

            const res = await fetch(`/api/products/${selectedProduct._id}`, {
                method: "PUT",
                body: productData,
            });

            const data = await res.json();

            if (res.ok) {
                notifications.success(data.message);
                setShowEditProductModal(false);
                fetchProducts();
            } else {
                notifications.error(data.message);
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        try {
            const res = await fetch(`/api/products/${productToDelete._id}`, { method: "DELETE" });
            const data = await res.json();

            if (res.ok) {
                notifications.success(data.message)
                setProducts(products.filter(prod => prod._id !== productToDelete._id));
                setShowDeleteProductModal(false);
            } else {
                notifications.error(data.message);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const productColumns = [
        { label: "Title", accessor: "title" },
        {
            label: "Category",
            accessor: "category",
            render: (row) => row.category?.name || "—",
        },
        { label: "Price", accessor: "price" },
        { label: "Discounted Price", accessor: "discountedPrice" },
        {
            label: "Main Image",
            accessor: "mainImage",
            render: (row) =>
                row.mainImage ? (
                    <img
                        src={`/uploads/${row.mainImage}`}
                        alt="Main"
                        className="w-12 h-12 object-cover rounded-md"
                    />
                ) : (
                    "No Image"
                ),
        },
        { label: "Features", accessor: "features" },
        { label: "Colours", accessor: "colors" },
        { label: "Sizes", accessor: "sizes" },
        { label: "Status", accessor: "status" },
        { label: "Stock", accessor: "stock" },
        {
            label: "Actions",
            accessor: "actions",
            render: (row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            const { category, ...rest } = row;
                            setSelectedProduct({
                                ...rest,
                                category: category?._id || category || "",
                                discountedPrice: row.discountedPrice || "",
                                colors: row.colors || [],
                                sizes: row.sizes || [],
                                features: row.features || "",
                                stock: row.stock || "",
                                status: row.status || "",
                            });
                            setShowEditProductModal(true);
                        }}
                        className="px-2 py-1 bg-green-100 text-green-950 rounded-md hover:bg-green-300"
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="px-2 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-300"
                        onClick={() => {
                            setProductToDelete(row);
                            setShowDeleteProductModal(true);
                        }}
                    >
                        <IoTrashOutline />
                    </button>
                </div>
            ),
        }
    ];

    return (
        <>
            <AdminLayout>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-[var(--primaryColor)] ">Products</h1>
                    <button
                        className="px-4 py-2 bg-[var(--primaryColor)]  text-white rounded-md hover:bg-[var(--primaryHoverColor)]"
                        onClick={() => setShowProductAddModal(true)}
                    >
                        Add Product
                    </button>
                </div>

                {loading ? (
                    <SkeletonTable columns={productColumns.length} />
                ) : (
                    <DataTable data={products} columns={productColumns} />
                )}

                {/* Add Product Modal */}
                {showProductAddModal && (
                    <Modal
                        isOpen={showProductAddModal}
                        title="Add Product"
                        fields={[
                            { name: "title", label: "Title", placeholder: "Enter Title" },
                            {
                                name: "category",
                                label: "Category",
                                type: "select",
                                options: categories.map((cat) => ({
                                    label: cat.name,
                                    value: cat._id,
                                })),
                            },
                            { name: "price", label: "Price", placeholder: "Enter Price" },
                            {
                                name: "discountedPrice",
                                label: "Discounted Price",
                                placeholder: "Enter Discounted Price",
                            },
                            { name: "mainImage", label: "Upload Main Image", type: "file" },  // Single file upload for main image
                            {
                                name: "subImages",
                                label: "Upload Sub Images",
                                type: "file",
                                multiple: true,
                            },
                            {
                                name: "features",
                                label: "Features (comma separated)",
                                placeholder: "Feature1, Feature2",
                            },
                            { name: "colors", label: "Colours", type: "color-multi" },
                            {
                                name: "sizes",
                                label: "Sizes",
                                type: "checkbox",
                                options: ["S", "M", "L", "XL"].map((v) => ({
                                    label: v,
                                    value: v,
                                })),
                            },
                            {
                                name: "status",
                                label: "Status",
                                type: "select",
                                options: ["New", "Sale", "Out of Stock"].map((v) => ({
                                    label: v,
                                    value: v,
                                })),
                            },
                            { name: "stock", label: "Stock", placeholder: "Enter Stock" },
                        ]}
                        values={newProduct}
                        onChange={handleInputChange}
                        onSave={handleAddProduct}
                        onClose={() => setShowProductAddModal(false)}
                    />
                )}

                {/* Edit Product Modal */}
                {showEditProductModal && selectedProduct && (
                    <Modal
                        isOpen={showEditProductModal}
                        title="Edit Product"
                        fields={[
                            { name: "title", label: "Title", placeholder: "Enter Title" },
                            {
                                name: "category",
                                label: "Category",
                                type: "select",
                                options: categories.map((cat) => ({
                                    label: cat.name,
                                    value: cat._id,
                                })),
                            },
                            { name: "price", label: "Price", placeholder: "Enter Price" },
                            {
                                name: "discountedPrice",
                                label: "Discounted Price",
                                placeholder: "Enter Discounted Price",
                            },
                            { name: "mainImage", label: "Upload Main Image", type: "file" },
                            {
                                name: "subImages",
                                label: "Upload Sub Images",
                                type: "file",
                                multiple: true,
                            },
                            {
                                name: "features",
                                label: "Features (comma separated)",
                                placeholder: "Feature1, Feature2",
                            },
                            { name: "colors", label: "Colours", type: "color-multi" },
                            {
                                name: "sizes",
                                label: "Sizes",
                                type: "checkbox",
                                options: ["S", "M", "L", "XL"].map((v) => ({
                                    label: v,
                                    value: v,
                                })),
                            },
                            {
                                name: "status",
                                label: "Status",
                                type: "select",
                                options: ["New", "Sale", "Out of Stock"].map((v) => ({
                                    label: v,
                                    value: v,
                                })),
                            },
                            { name: "stock", label: "Stock", placeholder: "Enter Stock" },
                        ]}
                        values={selectedProduct}
                        onChange={handleEditInputChange}
                        onSave={handleUpdateProduct}
                        onClose={() => setShowEditProductModal(false)}
                    />
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={showDeleteProductModal}
                    onClose={() => setShowDeleteProductModal(false)}
                    onDelete={handleDeleteProduct}
                    itemName={productToDelete?.title}
                />
            </AdminLayout>
        </>
    );
};

export default ProductsPage;
