import Order from '@/models/Order';
import EVoucher from '@/models/EVoucher';
import dbConnect from "@/lib/dbConnect";
import jwt from "jsonwebtoken";
import User from "@/models/User.js";
import { cookies } from 'next/headers';

export async function POST(req) {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return new Response(JSON.stringify({ error: 'No token provided' }), { status: 401 });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { items, totalAmount, shippingAddress, shippingMethod } = await req.json();

        // --- Generate Unique Order Number ---
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const datePrefix = `${yyyy}${mm}${dd}`;

        const latestOrder = await Order.findOne({
            orderNumber: { $regex: `^${datePrefix}-\\d{4}$` }
        }).sort({ createdAt: -1 });

        let sequence = 1;
        if (latestOrder) {
            const lastSeq = parseInt(latestOrder.orderNumber.split('-')[1]);
            sequence = lastSeq + 1;
        }

        const orderNumber = `${datePrefix}-${String(sequence).padStart(4, '0')}`;

        // --- Build Items List ---
        const formattedItems = await Promise.all(
            items.map(async (item) => {
                if (item.type === 'evoucher') {
                    // Fetch eVoucher to calculate validDate
                    const voucher = await EVoucher.findById(item.eVoucher);
                    const validDate = new Date();

                    switch (voucher.validPeriod.unit) {
                        case 'days':
                            validDate.setDate(validDate.getDate() + voucher.validPeriod.value);
                            break;
                        case 'weeks':
                            validDate.setDate(validDate.getDate() + voucher.validPeriod.value * 7);
                            break;
                        case 'months':
                            validDate.setMonth(validDate.getMonth() + voucher.validPeriod.value);
                            break;
                    }

                    // Update validDate and status in eVoucher
                    voucher.validDate = validDate;
                    voucher.status = 'active';
                    await voucher.save();

                    return {
                        type: 'evoucher',
                        eVoucher: voucher._id,
                        quantity: item.quantity,
                        price: item.price,
                        senderName: item.senderName,
                        receiverName: item.receiverName,
                        note: item.note,
                        validDate,
                    };
                } else {
                    return {
                        type: 'product',
                        product: item.product,
                        quantity: item.quantity,
                        price: item.price,
                        selectedColor: item.selectedColor,
                        selectedSize: item.selectedSize,
                    };
                }
            })
        );

        const newOrder = await Order.create({
            user: user._id,
            items: formattedItems,
            totalAmount,
            shippingAddress,
            shippingMethod,
            orderNumber,
        });

        return new Response(JSON.stringify(newOrder), { status: 201 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}


// Get all orders
export async function GET() {
    await dbConnect();

    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product", "title");

        return new Response(JSON.stringify(orders), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}