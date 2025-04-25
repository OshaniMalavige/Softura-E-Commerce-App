import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function GET() {
    await dbConnect();

    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(4)
            .populate("user", "username email")
            .populate("items.product", "title")
            .populate('items.eVoucher', 'code');

        return new Response(JSON.stringify(orders), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
