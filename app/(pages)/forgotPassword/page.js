"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Input from "@/components/Input.js";
import Button from "@/components/Button.js";
import notifications from "@/components/alerts/alerts.js";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/forgotPassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok) {
            setLoading(false);
            notifications.success(data.message);
        } else {
            notifications.error(data.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white px-4">
            <div className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row w-full max-w-7xl h-[90vh]">
                <div className="w-full md:w-1/2 h-1/3 md:h-full">
                    <Image
                        src="/assests/signup.gif"
                        alt="Signup Illustration"
                        width={800}
                        height={800}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <Link href="/" className="text-3xl font-bold mb-2 text-center flex items-center justify-center gap-2">
                        <Image
                            src="/assests/logo.png"
                            alt="Softura Logo"
                            width={180}
                            height={20}
                        />
                    </Link>
                    <h4 className="text-2xl text-[var(--primaryColor)] font-bold mb-2 text-center mt-4">Forgot Your Password!</h4>
                    <h6 className="text-md mb-6 text-center">Do not worry. Enter the email to reset your password</h6>
                    <Input
                        label="Enter your email"
                        value={email}
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onClick={handleSubmit} loading={loading}>
                        Send Reset Link
                    </Button>
                </div>
            </div>
        </div>
    );
}
