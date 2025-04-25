'use client'

import React, { useEffect, useState } from 'react'
import Header from "@/components/dashboard/Header.js"
import StatCard from "@/components/dashboard/StatCard.js"
import { IoTrendingUp } from "react-icons/io5"
import { FaFileArchive, FaPercent, FaShoppingCart, FaUserCog } from "react-icons/fa"
import DashboardChart from "@/components/dashboard/DashboardChart.js"
import OrderTable from "@/components/dashboard/OrderTable.js"
import AdminLayout from "@/components/AdminLayout.js"

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/stats')
                const data = await res.json()
                setStats(data)
            } catch (err) {
                console.error('Failed to fetch stats:', err)
            }
        }

        fetchStats()
    }, [])

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="w-full px-4 py-6 overflow-x-auto">
                    <div className="min-w-[1200px] mx-auto">
                        <div className="flex gap-4 mb-8">
                            <StatCard
                                title="Total Revenue"
                                value={`${stats.totalRevenue.toLocaleString()}`}
                                subtitle="From Paid Orders"
                                icon={<IoTrendingUp className="h-8 w-8 text-white" />}
                                color="bg-orange-400"
                            />
                            <StatCard
                                title="Total Orders"
                                value={stats.totalOrders}
                                subtitle="All-time Orders"
                                icon={<FaPercent className="h-8 w-8 text-white" />}
                                color="bg-blue-400"
                            />
                            <StatCard
                                title="Total Users"
                                value={stats.totalUsers}
                                subtitle="Registered Users"
                                icon={<FaUserCog className="h-8 w-8 text-white" />}
                                color="bg-green-500"
                            />
                            <StatCard
                                title="Total Products"
                                value={stats.totalProducts}
                                subtitle="Active Listings"
                                icon={<FaShoppingCart className="h-8 w-8 text-white" />}
                                color="bg-indigo-600"
                            />
                            <StatCard
                                title="Delivered Orders"
                                value={stats.deliveredOrders}
                                subtitle="Successful Deliveries"
                                icon={<FaFileArchive className="h-8 w-8 text-white" />}
                                color="bg-amber-400"
                            />
                        </div>

                        <div className="mb-8">
                            <DashboardChart />
                        </div>

                        <div>
                            <OrderTable />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

export default Dashboard
