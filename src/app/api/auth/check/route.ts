import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const authCookie = cookies().get("auth");
    const isAuthenticated = authCookie?.value === "true";

    if (isAuthenticated) {
      return NextResponse.json({ authenticated: true });
    }

    // Clear any invalid auth cookie
    cookies().delete("auth");

    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
