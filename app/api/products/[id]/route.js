import mongoose from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import path from "path";
import { unlink, writeFile } from "fs/promises";

// Helper function to extract params
async function getParams(params) {
    if (typeof params === 'function') {
        return await params();
    }
    return params;
}

// Get a product by ID
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const resolvedParams = await getParams(params);

        const product = await Product.findById(resolvedParams.id).populate("category");
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// Update a product
export async function PUT(req, { params }) {
    await dbConnect();
    const resolvedParams = await getParams(params);

    try {
        const formData = await req.formData();

        const title = formData.get("title");
        let category = formData.get("category");
        const price = parseFloat(formData.get("price")) || 0;
        const discountedPrice = parseFloat(formData.get("discountedPrice")) || 0;
        const features = formData.get("features")?.split(",").map(f => f.trim()) || [];
        const colors = formData.getAll("colors") || [];
        const sizes = formData.getAll("sizes") || [];
        const stock = parseInt(formData.get("stock")) || 0;
        const status = formData.get("status") || "New";

        if (!mongoose.Types.ObjectId.isValid(category)) {
            return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
        }

        // Find existing product
        const product = await Product.findById(resolvedParams.id);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Handle main image update
        let mainImage = product.mainImage;
        const mainImageFile = formData.get("mainImage");

        if (mainImageFile && mainImageFile.size > 0) {
            if (product.mainImage) {
                const oldImagePath = path.join(process.cwd(), "public/uploads", product.mainImage);
                try {
                    await unlink(oldImagePath);
                } catch (error) {
                    console.error("Error deleting old image:", error);
                }
            }

            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const filename = `${Date.now()}_${mainImageFile.name.replaceAll(" ", "_")}`;
            const filePath = path.join(process.cwd(), "public/uploads/", filename);
            await writeFile(filePath, buffer);
            mainImage = filename;
        }

        // Handle subImages update
        let subImages = product.subImages;
        const subImageFiles = formData.getAll("subImages");

        if (subImageFiles.length > 0 && subImageFiles[0] !== "null") {
            subImages = [];
            for (let subImageFile of subImageFiles) {
                const subBuffer = Buffer.from(await subImageFile.arrayBuffer());
                const subFilename = `${Date.now()}_${subImageFile.name.replaceAll(" ", "_")}`;
                const subFilePath = path.join(process.cwd(), "public/uploads/", subFilename);
                await writeFile(subFilePath, subBuffer);
                subImages.push(subFilename);
            }
        }

        // Update product
        const updatedProduct = await Product.findByIdAndUpdate(
            resolvedParams.id,
            {
                title,
                category,
                price,
                discountedPrice,
                features,
                colors,
                sizes,
                stock,
                status,
                mainImage,
                subImages,
            },
            { new: true }
        );

        return NextResponse.json({ message: "Product updated successfully", product: updatedProduct }, { status: 200 });
    } catch (error) {
        console.error("Error updating Product:", error);
        return NextResponse.json({ message: "Failed to update Product", error: error.message }, { status: 500 });
    }
}

// Delete a product
export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const resolvedParams = await getParams(params);

        const product = await Product.findByIdAndDelete(resolvedParams.id);
        console.log(resolvedParams.id)
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Delete main image
        if (product.mainImage) {
            const mainImagePath = path.join(process.cwd(), "public/uploads", product.mainImage);
            try {
                await unlink(mainImagePath);
            } catch (error) {
                console.error("Error deleting product image:", error);
            }
        }

        // Delete subImages
        for (let subImage of product.subImages) {
            const subImagePath = path.join(process.cwd(), "public/uploads", subImage);
            try {
                await unlink(subImagePath);
            } catch (error) {
                console.error(`Error deleting sub-image: ${subImage}`, error);
            }
        }

        return NextResponse.json({ message: "Product deleted successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ message: "Failed to delete product", error: error.message }, { status: 500 });
    }
}
