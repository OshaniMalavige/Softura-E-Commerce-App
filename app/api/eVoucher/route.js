import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import dbConnect from "@/lib/dbConnect";
import EVoucher from "@/models/EVoucher.js";

export const POST = async (req) => {
    await dbConnect();

    const formData = await req.formData();

    const amount = formData.get("amount");
    const code = formData.get("code");
    const periodValue = formData.get("validPeriodValue");
    const periodUnit = formData.get("validPeriodUnit");
    const file = formData.get("eImage");

    if (!amount || !code || !periodValue || !periodUnit || !file) {
        return NextResponse.json(
            { message: "Amount, code, valid time period (value and unit), and image are required." },
            { status: 400 }
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    const filePath = path.join(process.cwd(), "public/uploads/" + filename);

    try {
        await writeFile(filePath, buffer);

        const voucher = new EVoucher({
            amount,
            code,
            eImage: filename,
            validPeriod: {
                value: periodValue,
                unit: periodUnit,
            },
        });

        await voucher.save();

        return NextResponse.json({ message: "E voucher added successfully!", status: 201 });
    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json({ message: "Failed", status: 500 });
    }
}

// Get all vouchers
export async function GET() {
    try {
        await dbConnect();
        const vouchers = await EVoucher.find();
        return NextResponse.json(vouchers, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

