import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

// Create a new product
export const POST = async (req) => {
    await dbConnect();

    try {
        const formData = await req.formData();

        const title = formData.get("title");
        const stock = formData.get("stock");
        const category = formData.get("category");
        const price = parseFloat(formData.get("price"));
        const discountedPrice = parseFloat(formData.get("discountedPrice")) || 0;
        const features = formData.getAll("features") || [];
        const colors = formData.getAll("colors") || [];
        const sizes = formData.getAll("sizes") || [];
        const status = formData.get("status") || "New";
        const file = formData.get("mainImage");
        const subImages = formData.getAll("subImages");

        if (!title || !category || isNaN(price) || !file) {
            return NextResponse.json(
                { message: "Title, category, price, and main image are required." },
                { status: 400 }
            );
        }

        // Save the main image
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;
        const filePath = path.join(process.cwd(), "public/uploads/", filename);
        await writeFile(filePath, buffer);

        // Save sub-images
        const subImagePaths = [];
        for (let subImage of subImages) {
            const subBuffer = Buffer.from(await subImage.arrayBuffer());
            const subFilename = `${Date.now()}_${subImage.name.replaceAll(" ", "_")}`;
            const subFilePath = path.join(process.cwd(), "public/uploads/", subFilename);
            await writeFile(subFilePath, subBuffer);
            subImagePaths.push(subFilename);
        }

        // Create new product
        const product = new Product({
            title,
            category,
            price,
            discountedPrice,
            mainImage: filename,
            subImages: subImagePaths,
            features,
            colors,
            sizes,
            status,
            ratings: { rating: 0, count: 0 },
            purchases: 0,
            stock,
            reviews: [],
        });

        await product.save();

        return NextResponse.json({ message: "Product created successfully!", product, status: 201 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: "Failed to create product", error: error.message }, { status: 500 });
    }
};

// Get all products
export async function GET() {
    try {
        await dbConnect();
        const products = await Product.find().populate("category");
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ message: "Failed to fetch products", error: error.message }, { status: 500 });
    }
}
