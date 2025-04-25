import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

    // Clear the authentication cookie
    response.cookies.set("token", "", { maxAge: -1, path: "/" });

    // Clear the user object cookie
    response.cookies.set("user", "", { maxAge: -1, path: "/" });

    return response;
}
