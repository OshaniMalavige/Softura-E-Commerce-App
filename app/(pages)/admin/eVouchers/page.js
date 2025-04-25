"use client"

import {useEffect, useState} from "react";
import notifications from "@/components/alerts/alerts.js";
import {FaEdit} from "react-icons/fa";
import {IoTrashOutline} from "react-icons/io5";
import AdminLayout from "@/components/AdminLayout.js";
import DataTable from "@/components/DataTable.js";
import Modal from "@/components/Modal.js";
import ConfirmationModal from "@/components/ConfirmationModal.js";
import SkeletonTable from "@/components/SkeletonTable.js";

const EVouchersPage = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddEVoucherModal, setShowAddEVoucherModal] = useState(false);
    const [showEditEVoucherModal, setShowEditEVoucherModal] = useState(false);
    const [showDeleteEVoucherModal, setShowDeleteEVoucherModal] = useState(false);
    const [selectedEVoucher, setSelectedEVoucher] = useState(null);
    const [EVoucherToDelete, setEVoucherToDelete] = useState(null);
    const [newEVoucher, setNewEVoucher] = useState({
        amount: "",
        code: "",
        validPeriodValue: "",
        validPeriodUnit: "",
        eImage: null
    });


    useEffect(() => {
        fetchEVouchers();
    }, []);

    const fetchEVouchers = async () => {
        try {
            const res = await fetch("/api/eVoucher");
            const data = await res.json();
            setVouchers(data);
        } catch (error) {
            console.error("Error fetching vouchers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEVoucher = async () => {
        try {
            const formData = new FormData();
            formData.append("amount", newEVoucher.amount);
            formData.append("code", newEVoucher.code || "");
            formData.append("validPeriodValue", newEVoucher.validPeriodValue);
            formData.append("validPeriodUnit", newEVoucher.validPeriodUnit);
            if (newEVoucher.eImage) {
                formData.append("eImage", newEVoucher.eImage);
            }

            const res = await fetch("/api/eVoucher", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                notifications.success(data.message);
                setShowAddEVoucherModal(false);
                setNewEVoucher({ amount: "", code: "", validPeriodValue: "", validPeriodUnit: "", eImage: null });
                fetchEVouchers();
            } else {
                const errorText = await res.text();
                console.error("Error response:", errorText);
                notifications.error("Failed to add eVoucher. Check console for details.");
            }
        } catch (error) {
            console.error("Error adding voucher:", error);
        }
    };

    const handleUpdateEVoucher = async () => {
        if (!selectedEVoucher) return;

        try {
            const formData = new FormData();
            formData.append("code", selectedEVoucher.code);
            formData.append("amount", selectedEVoucher.amount);
            formData.append("validPeriodValue", selectedEVoucher.validPeriodValue);
            formData.append("validPeriodUnit", selectedEVoucher.validPeriodUnit);

            if (selectedEVoucher.eImage && selectedEVoucher.eImage instanceof File) {
                formData.append("eImage", selectedEVoucher.eImage);
            }

            const res = await fetch(`/api/eVoucher/${selectedEVoucher._id}`, {
                method: "PUT",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                notifications.success(data.message);
                setShowEditEVoucherModal(false);
                fetchEVouchers();
            } else {
                notifications.error(data.message);
            }
        } catch (error) {
            console.error("Error updating EVoucher:", error);
        }
    };

    const handleDeleteEVoucher = async () => {
        if (!EVoucherToDelete) return;
        try {
            const res = await fetch(`/api/eVoucher/${EVoucherToDelete._id}`, { method: "DELETE" });
            const data = await res.json();

            if (res.ok) {
                notifications.success(data.message)
                setVouchers(vouchers.filter(cat => cat._id !== EVoucherToDelete._id));
                setShowDeleteEVoucherModal(false);
            } else {
                notifications.error(data.message);
            }
        } catch (error) {
            console.error("Error deleting EVoucher:", error);
        }
    };

    const handleInputChange = (field, value) => {
        setNewEVoucher((prev) => ({ ...prev, [field]: value }));
    };

    const handleEditInputChange = (field, value) => {
        setSelectedEVoucher((prev) => ({ ...prev, [field]: value }));
    };

    const columns = [
        { label: "Code", accessor: "code" },
        { label: "Amount", accessor: "amount" },
        {
            label: "Valid Period",
            accessor: "validPeriod",
            render: (row) => {
                const period = row.validPeriod;
                return period?.value && period?.unit ? `${period.value} ${period.unit}` : "N/A";
            },
        },
        {
            label: "Image",
            accessor: "eImage",
            render: (row) =>
                row.eImage ? (
                    <img src={`/uploads/${row.eImage}`} alt="EVoucher" className="w-12 h-12 object-cover rounded-md" />
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
                            const { validPeriod = {}, ...rest } = row;
                            setSelectedEVoucher({
                                ...rest,
                                validPeriodValue: validPeriod.value || "",
                                validPeriodUnit: validPeriod.unit || "",
                            });
                            setShowEditEVoucherModal(true);
                        }}
                        className="px-2 py-1 bg-green-100 text-green-950 rounded-md hover:bg-green-300"
                    >
                        <FaEdit />
                    </button>
                    <button
                        className="px-2 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-300"
                        onClick={() => {
                            setEVoucherToDelete(row);
                            setShowDeleteEVoucherModal(true);
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
                <h1 className="text-2xl font-bold text-[var(--primaryColor)] ">E-Vouchers</h1>
                <button
                    className="px-4 py-2 bg-[var(--primaryColor)]  text-white rounded-md hover:bg-[var(--primaryHoverColor)] "
                    onClick={() => setShowAddEVoucherModal(true)}
                >
                    Add E-Voucher
                </button>
            </div>

            {loading ? <SkeletonTable columns={columns.length} /> : <DataTable data={vouchers} columns={columns} />}

            {/* Add EVoucher Modal */}
            {showAddEVoucherModal && (
                <Modal
                    isOpen={showAddEVoucherModal}
                    title="Add E-Voucher"
                    fields={[
                        { name: "code", label: "Code", placeholder: "Enter Code" },
                        { name: "amount", label: "Amount", placeholder: "Enter Amount" },
                        { name: "validPeriodValue", label: "Valid Period Value", placeholder: "e.g., 30" },
                        { name: "validPeriodUnit", label: "Valid Period Unit", placeholder: "e.g., days, weeks, months" },
                        { name: "eImage", label: "Upload Image", type: "file" }
                    ]}
                    values={newEVoucher}
                    onChange={handleInputChange}
                    onSave={handleAddEVoucher}
                    onClose={() => setShowAddEVoucherModal(false)}
                />
            )}

            {/* Edit EVoucher Modal */}
            {showEditEVoucherModal && selectedEVoucher && (
                <Modal
                    isOpen={showEditEVoucherModal}
                    title="Edit EVoucher"
                    fields={[
                        { name: "code", label: "Code", placeholder: "Enter Code" },
                        { name: "amount", label: "Amount", placeholder: "Enter Amount" },
                        { name: "validPeriodValue", label: "Valid Period Value", placeholder: "e.g., 30" },
                        { name: "validPeriodUnit", label: "Valid Period Unit", placeholder: "e.g., days, weeks, months" },
                        { name: "eImage", label: "Upload Image", type: "file" }
                    ]}
                    values={selectedEVoucher}
                    onChange={handleEditInputChange}
                    onSave={handleUpdateEVoucher}
                    onClose={() => setShowEditEVoucherModal(false)}
                />
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteEVoucherModal}
                onClose={() => setShowDeleteEVoucherModal(false)}
                onDelete={handleDeleteEVoucher}
                itemName={EVoucherToDelete?.amount}
            />
        </AdminLayout>
    );
}

export default EVouchersPage