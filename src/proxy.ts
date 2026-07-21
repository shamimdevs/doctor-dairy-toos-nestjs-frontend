import { NextRequest, NextResponse } from "next/server";

// Auth pages
const authRoutes = [
  "/login",
  "/forget-password",
  "/otp",
  "/signup",

  "/verify-otp",
];

// Next.js 16 expects either a named export 'proxy' or a default export
export async function proxy(request: NextRequest) {
  // ⚠️ IMPORTANT CHECK: Make sure your login flow actually saves a cookie called "refreshToken"
  const token = request.cookies.get("refreshToken")?.value;
  const pathname = request.nextUrl.pathname;

  // 1. Prevent logged-in users from accessing authentication pages
  if (token && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Redirect unauthenticated users to login page for protected routes
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Allow access & handle caching headers
  const response = NextResponse.next();
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

// Next.js 16 Static Matcher
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
