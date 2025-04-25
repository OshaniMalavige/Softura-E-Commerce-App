"use client"
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { zodResolver } from '@hookform/resolvers/zod';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { z } from 'zod';
import Input from "@/components/Input";
import Button from "@/components/Button";
import notifications from "@/components/alerts/alerts.js";

const schema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data) => {
        setLoading(true);
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        setLoading(false);

        if (res.ok) {
            router.push(`/verify?email=${data.email}`);
        } else {
            notifications.error(result.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white px-4">
            <div
                className="bg-white rounded-lg overflow-hidden flex flex-col md:flex-row w-full max-w-7xl h-[90vh]">
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
                    <h6 className="text-md mb-6 text-center">Glad to see you joining us. Please fill up the following fields to set up your account.</h6>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label="Username"
                            {...register('username')}
                            error={errors.username}
                        />
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
                        <Button type="submit" loading={loading}>
                            Sign Up
                        </Button>
                        <div className="text-sm mt-4 text-center">
                            <Link href="/login">Already have an account? <span
                                className="text-blue-600 hover:underline">Sign In</span></Link>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    );
}