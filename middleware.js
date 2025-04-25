import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
    // Extract token from cookies
    const token = req.cookies.get("token")?.value;

    // Redirect to log in if token is missing
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        // Decode the JWT using jose
        const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Encode the secret
        const { payload } = await jwtVerify(token, secret); // Verify and decode the token
        const userRole = payload.role; // Extract role from decoded token

        const adminRoute = req.nextUrl.pathname.startsWith("/admin");
        const customerRoute = req.nextUrl.pathname.startsWith("/customer");

        // Redirect customers away from admin routes
        if (adminRoute && userRole !== "67e36e0a9547b644b4b7acd5") {
            return NextResponse.redirect(new URL("/customer/home", req.url));
        }

        // Redirect admins away from customer routes
        if (customerRoute && userRole === "67e36e0a9547b644b4b7acd5") {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
    } catch (error) {
        console.error("Invalid token:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
    matcher: ["/admin/:path*", "/customer/:path*"],
};
