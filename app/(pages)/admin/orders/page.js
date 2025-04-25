"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout.js";
import DataTable from "@/components/DataTable.js";
import SkeletonTable from "@/components/SkeletonTable.js";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editedOrders, setEditedOrders] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (orderId, field, value) => {
        setEditedOrders((prev) => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                [field]: value,
            },
        }));
    };

    const saveChanges = async (orderId) => {
        const updates = editedOrders[orderId];
        if (!updates) return;

        try {
            await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId ? { ...order, ...updates } : order
                )
            );

            setEditedOrders((prev) => {
                const updated = { ...prev };
                delete updated[orderId];
                return updated;
            });
        } catch (err) {
            console.error("Failed to update order:", err);
        }
    };

    const columns = [
        { label: "Order Number", accessor: "orderNumber" },
        {
            label: "Items",
            accessor: "items",
            render: (row) => (
                <ul className="list-disc pl-4 space-y-1">
                    {row.items.map((item, index) => {
                        if (item.type === "evoucher") {
                            return (
                                <li key={index}>
                                    🎁 <strong>eVoucher</strong> (Qty: {item.quantity})<br />
                                    Sender: {item.senderName} | Receiver: {item.receiverName}<br />
                                    Note: {item.note}<br />
                                    Valid Date: {new Date(item.validDate).toLocaleDateString()}
                                </li>
                            );
                        } else {
                            return (
                                <li key={index}>
                                    🛒 {item.product?.title || "Product"} (Qty: {item.quantity}
                                    {item.selectedColor && `, Color: ${item.selectedColor}`}
                                    {item.selectedSize && `, Size: ${item.selectedSize}`})
                                </li>
                            );
                        }
                    })}
                </ul>
            )
        },
        { label: "Total Amount", accessor: "totalAmount" },
        {
            label: "Payment Status",
            accessor: "paymentStatus",
            render: (row) => (
                <select
                    value={
                        editedOrders[row._id]?.paymentStatus ?? row.paymentStatus ?? ""
                    }
                    onChange={(e) =>
                        handleChange(row._id, "paymentStatus", e.target.value)
                    }
                    className="border rounded px-2 py-1"
                >
                    <option value="">Select</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                </select>
            ),
        },
        { label: "Shipping Address", accessor: "shippingAddress" },
        { label: "Shipping Method", accessor: "shippingMethod" },
        {
            label: "Order Status",
            accessor: "orderStatus",
            render: (row) => (
                <select
                    value={
                        editedOrders[row._id]?.orderStatus ?? row.orderStatus ?? ""
                    }
                    onChange={(e) =>
                        handleChange(row._id, "orderStatus", e.target.value)
                    }
                    className="border rounded px-2 py-1"
                >
                    <option value="">Select</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            ),
        },
        {
            label: "Actions",
            accessor: "actions",
            render: (row) =>
                editedOrders[row._id] ? (
                    <button
                        onClick={() => saveChanges(row._id)}
                        className="bg-[var(--primaryColor)] text-white px-3 py-1 rounded hover:bg-[var(--primaryHoverColor)]"
                    >
                        Save
                    </button>
                ) : (
                    <span className="text-gray-400 text-sm italic">No changes</span>
                ),
        },
        { label: "Date", accessor: "createdAt" },
    ];

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-[var(--primaryColor)] ">Orders</h1>
            </div>

            {loading ? <SkeletonTable columns={columns.length} /> : <DataTable data={orders} columns={columns} />}
        </AdminLayout>
    );
};

export default OrdersPage;
