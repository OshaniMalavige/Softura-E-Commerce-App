import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();
        const user = await User.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Generate reset token valid for 15 minutes
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const resetUrl = `${process.env.FRONTEND_URL}/resetPassword?token=${resetToken}`;

        // Read HTML template
        const templatePath = path.join(process.cwd(), "templates", "resetpassword.html");
        let emailHtml = fs.readFileSync(templatePath, "utf-8");

        // Replace placeholders with actual values
        emailHtml = emailHtml.replace("{{resetUrl}}", resetUrl);

        // Send email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset",
            html: emailHtml, // Use the processed HTML template
        });

        return new Response(JSON.stringify({ message: "Password reset email sent" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
