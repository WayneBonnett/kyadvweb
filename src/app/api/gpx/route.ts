import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";
import { parseGPX } from "@/utils/gpxParser";

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

// Create GPX directory if it doesn't exist
async function ensureGpxDirectory() {
  const gpxDir = path.join(process.cwd(), "public", "content", "gpx");
  console.log("Checking GPX directory:", gpxDir);
  try {
    await fs.access(gpxDir);
    console.log("GPX directory exists");
  } catch {
    console.log("Creating GPX directory");
    await fs.mkdir(gpxDir, { recursive: true });
    console.log("GPX directory created");
  }
  return gpxDir;
}

export async function POST(request: Request) {
  console.log("Starting GPX file upload");

  // Verify authentication
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    console.log("Authentication failed");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  console.log("Authentication successful");

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    console.log("Received form data:", {
      title,
      description,
      fileName: file?.name,
    });

    if (!title || !file) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Title and file are required" },
        { status: 400 }
      );
    }

    if (!file.name.endsWith(".gpx")) {
      console.log("Invalid file type");
      return NextResponse.json(
        { error: "Only GPX files are allowed" },
        { status: 400 }
      );
    }

    const gpxDir = await ensureGpxDirectory();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(gpxDir, fileName);
    console.log("Saving file to:", filePath);

    // Save GPX file
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);
    console.log("GPX file saved successfully");

    // Parse GPX file to get route statistics
    const gpxContent = fileBuffer.toString("utf-8");
    const routeStats = await parseGPX(gpxContent);

    // Save metadata
    const metadataPath = path.join(gpxDir, `${fileName}.json`);
    const metadata = {
      title,
      description: description || routeStats.description,
      fileName,
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      distance: routeStats.distance,
      elevation: routeStats.elevation,
    };
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    console.log("Metadata saved successfully");

    return NextResponse.json({ success: true, file: metadata });
  } catch (error) {
    console.error("Error uploading GPX file:", error);
    return NextResponse.json(
      { error: "Failed to upload GPX file" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const gpxDir = await ensureGpxDirectory();
    const files = await fs.readdir(gpxDir);

    const gpxFiles = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          const content = await fs.readFile(path.join(gpxDir, file), "utf-8");
          return JSON.parse(content);
        })
    );

    // Sort files by upload date, newest first
    gpxFiles.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({ files: gpxFiles });
  } catch (error) {
    console.error("Error fetching GPX files:", error);
    return NextResponse.json(
      { error: "Failed to fetch GPX files" },
      { status: 500 }
    );
  }
}
