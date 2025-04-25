"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import notifications from "@/components/alerts/alerts";
import Input from "@/components/Input.js";
import Button from "@/components/Button.js";


export default function ResetPassword() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (!token) {
            notifications.error("Invalid or missing token")
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!token) {
            notifications.error("Token is missing")
            return;
        }
        if (newPassword !== confirmPassword) {
            notifications.error("Passwords are mismatch")
            return;
        }

        const res = await fetch("/api/resetPassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, newPassword }),
        });

        const data = await res.json();

        if (res.ok) {
            setLoading(false);
            notifications.success(data.message);
            router.push("/login");
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
                    <h4 className="text-2xl text-[var(--primaryColor)] font-bold mb-2 text-center mb-6">Reset Password</h4>
                    <Input
                        label="Enter New Password"
                        value={newPassword}
                        type="password"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                        label="Confirm Password"
                        value={confirmPassword}
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button onClick={handleSubmit} loading={loading}>
                        Reset Password
                    </Button>
                </div>
            </div>
        </div>
    );
}
