import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./hooks/verifyToken";

// Authentication pages
const authRoutes = [
  "/login",
  "/forget-password",
  "/otp",
  "/signup",
  "/verify-otp",
];

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("refreshToken")?.value;
  const pathname = request.nextUrl.pathname;

  // Safely decode and verify the token
  const decodedToken = token ? verifyToken(token) : null;
  const userRole = decodedToken?.role;

  // 1. Prevent authenticated users from visiting auth pages
  if (decodedToken && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. RESTRICT ENTIRE /dashboard TO SUPER_ADMIN ONLY
  if (pathname.startsWith("/dashboard")) {
    // If no valid token exists, redirect to login
    if (!decodedToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // If logged in but NOT a super_admin, redirect away (e.g., to home or unauthorized page)
    if (userRole !== "super_admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 3. Set standard non-cache headers & continue
  const response = NextResponse.next();
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/forget-password",
    "/otp",
    "/signup",
    "/verify-otp",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
