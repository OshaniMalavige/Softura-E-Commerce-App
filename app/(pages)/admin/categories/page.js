"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import notifications from "@/components/alerts/alerts.js";
import { FaEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import ConfirmationModal from "@/components/ConfirmationModal.js";
import SkeletonTable from "@/components/SkeletonTable.js";

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({ name: "", description: "", image: null });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
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

    const handleAddCategory = async () => {
        try {
            const formData = new FormData();
            formData.append("name", newCategory.name);
            formData.append("description", newCategory.description || "");
            if (newCategory.image) {
                formData.append("image", newCategory.image);
            }

            const res = await fetch("/api/categories", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                notifications.success(data.message);
                setShowAddModal(false);
                setNewCategory({ name: "", description: "", image: null });
                fetchCategories();
            } else {
                notifications.error(data.message);
            }
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const handleUpdateCategory = async () => {
        if (!selectedCategory) return;

        try {
            const formData = new FormData();
            formData.append("name", selectedCategory.name);
            formData.append("description", selectedCategory.description);

            if (selectedCategory.image && selectedCategory.image instanceof File) {
                formData.append("image", selectedCategory.image);
            }

            const res = await fetch(`/api/categories/${selectedCategory._id}`, {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                notifications.success(data.message);
                setShowEditModal(false);
                fetchCategories();
            } else {
                notifications.error(data.message);
            }
        } catch (error) {
            console.error("Error updating category:", error);
        }
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            const res = await fetch(`/api/categories/${categoryToDelete._id}`, { method: "DELETE" });
            const data = await res.json();

            if (res.ok) {
                notifications.success(data.message)
                setCategories(categories.filter(cat => cat._id !== categoryToDelete._id));
                setShowDeleteModal(false);
            } else {
                notifications.error(data.message);
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const handleInputChange = (field, value) => {
        setNewCategory((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditInputChange = (field, value) => {
        setSelectedCategory((prev) => ({ ...prev, [field]: value }));
    };

    const columns = [
        { label: "Name", accessor: "name" },
        { label: "Description", accessor: "description" },
        {
            label: "Image",
            accessor: "image",
            render: (row) =>
                row.image ? (
                    <img src={`/uploads/${row.image}`} alt="Category" className="w-12 h-12 object-cover rounded-md" />
                ) : (
                    "No Image"
                ),
        },
        {
            label: "Actions",
            accessor: "actions",
            render: (row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => {
                            setSelectedCategory(row);
                            setShowEditModal(true);
                        }}
                        className="px-2 py-1 bg-green-100 text-green-950 rounded-md hover:bg-green-300"
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="px-2 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-300"
                        onClick={() => {
                            setCategoryToDelete(row);
                            setShowDeleteModal(true);
                        }}
                    >
                        <IoTrashOutline />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-[var(--primaryColor)] ">Categories</h1>
                <button
                    className="px-4 py-2 bg-[var(--primaryColor)]  text-white rounded-md hover:bg-[var(--primaryHoverColor)] "
                    onClick={() => setShowAddModal(true)}
                >
                    Add Category
                </button>
            </div>

            {loading ? <SkeletonTable columns={columns.length} /> : <DataTable data={categories} columns={columns} />}

            {/* Add Category Modal */}
            {showAddModal && (
                <Modal
                    isOpen={showAddModal}
                    title="Add Category"
                    fields={[
                        { name: "name", label: "Category Name", placeholder: "Enter category name" },
                        { name: "description", label: "Description", placeholder: "Enter category description" },
                        { name: "image", label: "Upload Image", type: "file" }
                    ]}
                    values={newCategory}
                    onChange={handleInputChange}
                    onSave={handleAddCategory}
                    onClose={() => setShowAddModal(false)}
                />
            )}

            {/* Edit Category Modal */}
            {showEditModal && selectedCategory && (
                <Modal
                    isOpen={showEditModal}
                    title="Edit Category"
                    fields={[
                        { name: "name", label: "Category Name", placeholder: "Enter category name" },
                        { name: "description", label: "Description", placeholder: "Enter category description" },
                        { name: "image", label: "Upload Image (optional)", type: "file" }
                    ]}
                    values={selectedCategory}
                    onChange={handleEditInputChange}
                    onSave={handleUpdateCategory}
                    onClose={() => setShowEditModal(false)}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onDelete={handleDeleteCategory}
                itemName={categoryToDelete?.name}
            />
        </AdminLayout>
    );
};

export default CategoriesPage;