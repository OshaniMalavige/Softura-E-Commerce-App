import dbConnect from "@/lib/dbConnect";
import Order from "@/models/Order";
import {NextResponse} from "next/server";

// Helper function to extract params
async function getParams(params) {
    if (typeof params === 'function') {
        return await params();
    }
    return params;
}

export async function PUT(req, { params }) {
    await dbConnect();
    const resolvedParams = await getParams(params);
    const body = await req.json();

    try {

        const order = await Order.findById(resolvedParams.id);

        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        const updatedOrder = await Order.findByIdAndUpdate(resolvedParams.id, body, { new: true });
        return NextResponse.json({ message: "Order updated successfully", order: updatedOrder }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update order", error: error.message }, { status: 500 });
    }
}
