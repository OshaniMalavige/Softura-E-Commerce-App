"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import Input from "@/components/Input";
import Button from "@/components/Button";
import notifications from "@/components/alerts/alerts.js";

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (res.ok) {
                notifications.success(result.message);

                // Encrypt the user object
                const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(result.user), '!ODM@#$96').toString();
                Cookies.set('user', encryptedUser, { expires: 1/24 });

                if (result.user.role === "67e36e0a9547b644b4b7acd5") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/customer/home");
                }
            } else {
                notifications.error(result.message || "Login failed");
            }
        } catch (error) {
            notifications.error("An error occurred during login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white px-4">
            <div className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row w-full max-w-7xl h-[90vh]">
                <div className="w-full md:w-1/2 h-1/3 md:h-full">
                    <Image
                        src="/assests/login.gif"
                        alt="Login Illustration"
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
                    <h6 className="text-md mb-6 text-center">Glad to see you joined us. Please enter your data to sign
                        in.</h6>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label="Email"
                            type="email"
                            {...register('email')}
                            error={errors.email}
                        />
                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                {...register('password')}
                                error={errors.password}
                            />
                            <span
                                className="absolute right-4 top-10 cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </span>
                        </div>
                        <div className="flex text-sm mt-2">
                            <Link href="/forgotPassword" className="text-blue-600 hover:underline">Forgot
                                password?</Link>
                        </div>
                        <div className="mt-6">
                            <Button type="submit" loading={loading} className="w-full">
                                Sign In
                            </Button>
                        </div>
                        <div className="text-sm mt-4 text-center">
                            <Link href="/signup">Don&#39;t have an account? <span
                                className="text-blue-600 hover:underline">Sign Up</span></Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}