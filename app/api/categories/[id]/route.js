import { NextResponse } from "next/server";
import path from "path";
import { writeFile, unlink } from "fs/promises";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

// Helper function to extract params
async function getParams(params) {
    if (typeof params === 'function') {
        return await params();
    }
    return params;
}

// Get a category by ID
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const resolvedParams = await getParams(params);
        const category = await Category.findById(resolvedParams.id);
        if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });
        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

// Update a category
export async function PUT(req, { params }) {
    await dbConnect();
    const resolvedParams = await getParams(params);

    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const file = formData.get("image");

    if (!name || !description) {
        return NextResponse.json(
            { message: "Name and description are required." },
            { status: 400 }
        );
    }

    try {
        const category = await Category.findById(resolvedParams.id);
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        let updatedData = { name, description };

        if (file && file.size > 0) {
            // Delete old image if it exists
            if (category.image) {
                const oldImagePath = path.join(process.cwd(), "public/uploads", category.image);
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

            updatedData.image = filename;
        }

        // Update category
        const updatedCategory = await Category.findByIdAndUpdate(resolvedParams.id, updatedData, { new: true });

        return NextResponse.json({ message: "Category updated successfully", category: updatedCategory }, { status: 200 });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ message: "Failed to update category", error: error.message }, { status: 500 });
    }
}

// Delete a category
export async function DELETE(req, { params }) {
    await dbConnect();
    const resolvedParams = await getParams(params);

    try {
        const category = await Category.findById(resolvedParams.id);
        if (!category) {
            return NextResponse.json({ message: "Category not found" }, { status: 404 });
        }

        // Delete image file if it exists
        if (category.image) {
            const imagePath = path.join(process.cwd(), "public/uploads", category.image);
            try {
                await unlink(imagePath);
            } catch (error) {
                console.error("Error deleting image:", error);
            }
        }

        await Category.findByIdAndDelete(resolvedParams.id);

        return NextResponse.json({ message: "Category deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ message: "Failed to delete category", error: error.message }, { status: 500 });
    }
}