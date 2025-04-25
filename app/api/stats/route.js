import dbConnect from "@/lib/dbConnect.js"
import Order from "@/models/Order.js"
import User from "@/models/User.js"
import Product from "@/models/Product.js"

export async function GET() {
    try {
        await dbConnect()

        const [totalOrders, totalUsers, totalProducts, deliveredOrders] = await Promise.all([
            Order.countDocuments(),
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments({ orderStatus: 'delivered' }),
        ])

        const totalRevenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ])
        const totalRevenue = totalRevenueResult[0]?.total || 0

        return new Response(JSON.stringify({
            totalOrders,
            totalUsers,
            totalProducts,
            deliveredOrders,
            totalRevenue,
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })
    } catch (error) {
        console.error('Stats API error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}
