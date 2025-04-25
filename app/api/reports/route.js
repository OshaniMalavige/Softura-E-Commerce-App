import dbConnect from '@/lib/dbConnect';
import Order from "@/models/Order";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        await dbConnect();

        const { start, end } = req.query;

        const match = {};
        if (start && end) {
            const startDate = new Date(`${start}-01`);
            const endDate = new Date(`${end}-01`);
            endDate.setMonth(endDate.getMonth() + 1); // include the full end month
            match.createdAt = { $gte: startDate, $lt: endDate };
        }

        const report = await Order.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    totalSales: { $sum: "$totalAmount" },
                    totalOrders: { $sum: 1 },
                },
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1,
                },
            },
        ]);

        const formatted = report.map((r) => ({
            month: `${r._id.year}-${String(r._id.month).padStart(2, "0")}`,
            totalSales: r.totalSales,
            totalOrders: r.totalOrders,
        }));

        return NextResponse.json(formatted, { message: "Report Generated Successfully!" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}