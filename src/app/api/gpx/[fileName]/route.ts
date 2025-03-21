import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

// Verify authentication
async function verifyAuth() {
  const authCookie = cookies().get("auth");
  if (!authCookie) {
    console.log("No auth cookie found");
    return false;
  }
  console.log("Auth cookie found");
  return true;
}

export async function DELETE(
  request: Request,
  { params }: { params: { fileName: string } }
) {
  // Verify authentication
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    console.log("Authentication failed");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("Authentication successful");

  try {
    const gpxDir = path.join(process.cwd(), "public", "content", "gpx");
    const gpxFile = params.fileName;
    const gpxPath = path.join(gpxDir, gpxFile);
    const metadataPath = path.join(gpxDir, `${gpxFile}.json`);

    // Check if files exist
    try {
      await fs.access(gpxPath);
      await fs.access(metadataPath);
    } catch {
      console.log("Files not found");
      return NextResponse.json(
        { error: "GPX file not found" },
        { status: 404 }
      );
    }

    // Delete both the GPX file and its metadata
    await fs.unlink(gpxPath);
    await fs.unlink(metadataPath);
    console.log("Files deleted successfully");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting GPX file:", error);
    return NextResponse.json(
      { error: "Failed to delete GPX file" },
      { status: 500 }
    );
  }
}
