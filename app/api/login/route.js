import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
    try {
        await dbConnect();

        const { email, password } = await req.json();

        // Find user and explicitly include password for comparison
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            console.log("User not found");
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            console.log("Incorrect password");
            return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Return only necessary user details
        const userData = {
            email: user.email,
            username: user.username,
            role: user.role,
        };

        // Set HTTP-only cookie
        const response = NextResponse.json({ message: "Login successful", user: userData });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60,
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Error occurred during login:", error);
        return NextResponse.json({ message: "Internal server error", error: error.message }, { status: 500 });
    }
}
