import dbConnect from "@/lib/dbConnect"
import Order from "@/models/Order"

export async function GET() {
    try {
        await dbConnect()

        const currentYear = new Date().getFullYear()
        const pipeline = [
            {
                $match: {
                    paymentStatus: 'paid',
                    createdAt: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lte: new Date(`${currentYear}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$totalAmount" }
                }
            },
            {
                $project: {
                    month: '$_id',
                    total: 1,
                    _id: 0
                }
            },
            { $sort: { month: 1 } }
        ]

        const result = await Order.aggregate(pipeline)

        // Format data for chart.js (ensure every month is filled)
        const monthlyData = Array(12).fill(0)
        result.forEach(item => {
            monthlyData[item.month - 1] = item.total
        })

        return new Response(JSON.stringify({ monthlySales: monthlyData }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        })
    } catch (error) {
        console.error('Monthly Sales API error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
}
