import dbConnect from "@/lib/dbConnect.js";
import User from "@/models/User.js";
import sendEmail from "@/utils/sendEmail.js";

export async function POST(req) {
    try {
        await dbConnect();
        const { email } = await req.json();

        const user = await User.findOne({ email });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        if (user.isVerified) {
            return new Response(JSON.stringify({ message: "User already verified" }), { status: 400 });
        }

        // Only generate a new verification code if it doesn't exist
        if (!user.verificationCode) {
            user.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            await user.save();

            // Send verification email only if a new code was created
            await sendEmail(user.email, "Your Verification Code", `Your verification code is: ${user.verificationCode}`);
        }

        return new Response(JSON.stringify({ message: "Verification code sent successfully" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
    }
}
