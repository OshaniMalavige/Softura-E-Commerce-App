import dbConnect from "@/lib/dbConnect.js";
import Product from "@/models/Product.js";
import Category from "@/models/Category.js";
import { NextResponse } from "next/server";

// Helper function to extract params
async function getParams(params) {
    if (typeof params === 'function') {
        return await params();
    }
    return params;
}

// Get Products by Category ID
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const resolvedParams = await getParams(params);

        // Fetch category details
        const category = await Category.findById(resolvedParams.id);
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        // Fetch products by category ID
        const products = await Product.find({ category: resolvedParams.id }).populate("category");

        return NextResponse.json({
            categoryName: category.name,
            products: products,
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
