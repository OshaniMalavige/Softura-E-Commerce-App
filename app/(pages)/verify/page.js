"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Input from "@/components/Input";
import Button from "@/components/Button";
import notifications from "@/components/alerts/alerts.js";

export default function Verify() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60); // Countdown starts from 60 seconds
    const [showResendButton, setShowResendButton] = useState(false);
    const [emailSent, setEmailSent] = useState(false); // Track if the email has been sent

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(countdown);
        } else {
            setShowResendButton(true); // Show the button when timer ends
        }
    }, [timer]);

    useEffect(() => {
        const sendInitialEmail = async () => {
            if (!emailSent) {  // Ensure the email is sent only once
                setLoading(true);
                const res = await fetch("/api/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });

                const result = await res.json();
                setLoading(false);

                if (res.ok) {
                    notifications.success("Verification code sent successfully");
                    setEmailSent(true); // Mark email as sent to prevent duplicates
                } else {
                    notifications.error(result.message);
                }
            }
        };

        sendInitialEmail();
    }, [email]); // Removed `emailSent` from dependencies to avoid multiple calls

    const handleVerify = async () => {
        setLoading(true);
        const res = await fetch("/api/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
        });

        const result = await res.json();
        setLoading(false);

        if (res.ok) {
            notifications.success("Account activated successfully");
            router.push("/login");
        } else {
            notifications.error(result.message);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        const res = await fetch("/api/verify", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const result = await res.json();
        setLoading(false);

        if (res.ok) {
            notifications.success("New verification code sent successfully");
            setTimer(60); // Reset the timer
            setShowResendButton(false); // Hide the resend button
        } else {
            notifications.error(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white px-4">
            <div className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row w-full max-w-7xl h-[90vh]">
                <div className="w-full md:w-1/2 h-1/3 md:h-full">
                    <Image
                        src="/assests/signup.gif"
                        alt="SignUp Illustration"
                        width={800}
                        height={800}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                    <h2 className="text-3xl text-[var(--primaryColor)] font-bold mb-2 text-center">Verify Your Email</h2>
                    <p className="text-gray-600 mb-4 text-center">Enter the 6-digit code sent to your email</p>
                    <Input
                        label="Verification Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <Button onClick={handleVerify} loading={loading}>
                        Verify
                    </Button>

                    <p className="text-gray-800 font-bold text-center mt-4 mb-2">
                        {showResendButton ? "Didn't receive the code?" : `Resend code in ${timer}s`}
                    </p>

                    {showResendButton && (
                        <Button onClick={handleResendCode} className="mt-2">
                            Resend Code
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}