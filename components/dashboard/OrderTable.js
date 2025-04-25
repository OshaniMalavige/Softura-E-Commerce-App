'use client'

import { useEffect, useState } from 'react'

const OrderTable = () => {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/dashboardOrders')
                const data = await res.json()
                setOrders(data)
            } catch (error) {
                console.error('Failed to fetch orders:', error)
            }
        }

        fetchOrders()
    }, [])

    return (
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-[var(--primaryColor)]">Recent Orders</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="text-md text-blue-900 bg-[#F1EFEC]">
                        <th className="px-6 py-3 text-left">Customer</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Amount</th>
                        <th className="px-6 py-3 text-left">Product</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order._id} className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                            <td className="px-6 py-4 border-b border-gray-300">
                                {order.user?.username}
                            </td>
                            <td className="px-6 py-4">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-orange-600 font-medium">
                                LKR{order.totalAmount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                                {order.items[0]?.type === "evoucher"
                                    ? order.items[0]?.eVoucher?.code
                                    : order.items[0]?.product?.title || '—'
                                }
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OrderTable
