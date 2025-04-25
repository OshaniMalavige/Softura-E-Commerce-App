import { NextResponse } from "next/server";
import path from "path";
import { writeFile, unlink } from "fs/promises";
import dbConnect from "@/lib/dbConnect";
import EVoucher from "@/models/EVoucher.js";

// Helper function to extract params
async function getParams(params) {
    if (typeof params === 'function') {
        return await params();
    }
    return params;
}

// =================== GET ===================
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const resolvedParams = await getParams(params);
        const voucher = await EVoucher.findById(resolvedParams.id);
        if (!voucher) return NextResponse.json({ message: "Voucher not found" }, { status: 404 });
        return NextResponse.json(voucher, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// =================== PUT ===================
export async function PUT(req, { params }) {
    await dbConnect();
    const resolvedParams = await getParams(params);

    const formData = await req.formData();
    const amount = formData.get("amount");
    const code = formData.get("code");
    const periodValue = formData.get("validPeriodValue");
    const periodUnit = formData.get("validPeriodUnit");
    const file = formData.get("eImage");

    if (!amount || !code || !periodValue || !periodUnit) {
        return NextResponse.json(
            { message: "Amount, code, and valid period (value + unit) are required." },
            { status: 400 }
        );
    }

    try {
        const voucher = await EVoucher.findById(resolvedParams.id);
        if (!voucher) {
            return NextResponse.json({ message: "Voucher not found" }, { status: 404 });
        }

        let updatedData = {
            amount,
            code,
            validPeriod: {
                value: periodValue,
                unit: periodUnit,
            },
        };

        if (file && file.size > 0) {
            // Delete old image if it exists
            if (voucher.eImage) {
                const oldImagePath = path.join(process.cwd(), "public/uploads", voucher.eImage);
                try {
                    await unlink(oldImagePath);
                } catch (error) {
                    console.error("Error deleting old image:", error);
                }
            }

            // Save new image
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = Date.now() + file.name.replaceAll(" ", "_");
            const filePath = path.join(process.cwd(), "public/uploads", filename);
            await writeFile(filePath, buffer);

            updatedData.eImage = filename;
        }

        const updatedVoucher = await EVoucher.findByIdAndUpdate(resolvedParams.id, updatedData, { new: true });

        return NextResponse.json({ message: "Voucher updated successfully", voucher: updatedVoucher }, { status: 200 });
    } catch (error) {
        console.error("Error updating voucher:", error);
        return NextResponse.json({ message: "Failed to update voucher", error: error.message }, { status: 500 });
    }
}

// =================== DELETE ===================
export async function DELETE(req, { params }) {
    await dbConnect();
    const resolvedParams = await getParams(params);

    try {
        const voucher = await EVoucher.findById(resolvedParams.id);
        if (!voucher) {
            return NextResponse.json({ message: "Voucher not found" }, { status: 404 });
        }

        // Delete image file if it exists
        if (voucher.eImage) {
            const imagePath = path.join(process.cwd(), "public/uploads", voucher.eImage);
            try {
                await unlink(imagePath);
            } catch (error) {
                console.error("Error deleting image:", error);
            }
        }

        await EVoucher.findByIdAndDelete(resolvedParams.id);

        return NextResponse.json({ message: "EVoucher deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting EVoucher:", error);
        return NextResponse.json({ message: "Failed to delete EVoucher", error: error.message }, { status: 500 });
    }
}
