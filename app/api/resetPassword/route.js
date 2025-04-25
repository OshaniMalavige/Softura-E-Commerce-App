import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await dbConnect();
        const { token, newPassword } = await req.json();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return new Response(JSON.stringify({ message: "Invalid token" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return new Response(JSON.stringify({ message: "Password reset successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ message: "Invalid or expired token" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
}
