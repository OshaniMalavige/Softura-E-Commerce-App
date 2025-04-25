import { hash } from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Role from "@/models/Role";
import sendEmail from "@/utils/sendEmail";

export async function POST(req) {
    try {
        await dbConnect();
        const { username, email, password } = await req.json();

        // Find the "customer" role
        const customerRole = await Role.findOne({ name: "customer" });
        if (!customerRole) {
            return new Response(JSON.stringify({ message: "Default role not found" }), { status: 500 });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return new Response(JSON.stringify({ message: "Username or email already exists" }), { status: 400 });
        }

        // Hash the password before saving it
        const hashedPassword = await hash(password, 12);

        // Generate a 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save user with verification status
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: customerRole._id,
            isVerified: false,
            verificationCode
        });
        await user.save();

        // Send verification email
        await sendEmail(email, "Verify Your Account", `Your verification code is: ${verificationCode}`);

        return new Response(JSON.stringify({ message: "User registered, please verify your email." }), { status: 201 });
    } catch (error) {
        console.error("Error occurred:", error);
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}
