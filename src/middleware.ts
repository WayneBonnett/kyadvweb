import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, verifyCSRFToken } from "@/utils/auth";

export function middleware(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";
  const authCookie = request.cookies.get("auth");
  const csrfToken = request.cookies.get("csrf")?.value;

  // Allow access to login page
  if (isLoginRoute) {
    return NextResponse.next();
  }

  // Check authentication for admin routes
  if (isAdminRoute) {
    if (!authCookie || authCookie.value !== "true") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Check CSRF token for POST requests
    if (request.method === "POST") {
      const csrfHeader = request.headers.get("x-csrf-token");
      if (!csrfHeader || !csrfToken || !verifyCSRFToken(csrfHeader)) {
        return NextResponse.json(
          { error: "Invalid CSRF token" },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
