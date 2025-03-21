import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { withRateLimit } from "@/utils/rateLimiter";

async function loginHandler(request: Request) {
  try {
    const { username, password } = await request.json();
    console.log("Login attempt for username:", username);

    // Verify environment variables
    const adminUsername = "kentuckyadv";
    const adminPasswordHash =
      "$2a$10$zZC.jnr9ypKCfRxpTG2xDedwx9rZH/a.CsvQ6CPUSlhgdXOHETdny";

    // Debug logging
    console.log("Environment variables:");
    console.log("ADMIN_USERNAME:", adminUsername);
    console.log("ADMIN_PASSWORD_HASH:", adminPasswordHash);

    // Check username
    if (username !== adminUsername) {
      console.log("Invalid username attempt:", username);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    console.log("Verifying password...");
    const isValidPassword = await bcrypt.compare(password, adminPasswordHash);
    console.log("Password verification result:", isValidPassword);

    if (!isValidPassword) {
      console.log("Invalid password attempt for user:", username);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Set cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    console.log("Login successful for user:", username);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(loginHandler);
