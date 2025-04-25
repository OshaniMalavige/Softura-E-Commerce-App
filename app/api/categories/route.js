import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import dbConnect from "@/lib/dbConnect";
import Category from "@/models/Category";

// Create a new category
export const POST = async (req) => {
    await dbConnect();

    const formData = await req.formData();

    const name = formData.get("name");
    const description = formData.get("description");
    const file = formData.get("image");

    if (!name || !description || !file) {
        return NextResponse.json(
            { message: "Name, description, price, and main image are required." },
            { status: 400 }
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    const filePath = path.join(process.cwd(), "public/uploads/" + filename);

    try {
        await writeFile(filePath, buffer);

        const category = new Category({
            name,
            description,
            image: filename,
        });

        await category.save();

        return NextResponse.json({ message: "Category added successfully!", status: 201 });
    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json({ message: "Failed", status: 500 });
    }
}

// Get all categories
export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find();
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
