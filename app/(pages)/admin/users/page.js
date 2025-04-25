"use client"

import { useEffect, useState } from "react";
import notifications from "@/components/alerts/alerts.js";
import AdminLayout from "@/components/AdminLayout.js";
import DataTable from "@/components/DataTable.js";
import SkeletonTable from "@/components/SkeletonTable.js";

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users");
            const data = await res.json();

            // Flatten the role.name
            const processedUsers = data.map(user => ({
                ...user,
                role: user.role?.name || "N/A",
            }));

            setUsers(processedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
            notifications.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { label: "User Name", accessor: "username" },
        { label: "Email", accessor: "email" },
        { label: "Role", accessor: "role" },
        { label: "Joined Date", accessor: "createdAt" },
    ];

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-[var(--primaryColor)]">Users</h1>
            </div>

            {loading ? <SkeletonTable columns={columns.length} /> : <DataTable data={users} columns={columns} />}
        </AdminLayout>
    );
};

export default UsersPage;
