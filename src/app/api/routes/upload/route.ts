import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const gpxFile = formData.get("gpxFile") as File;
    const imageFile = formData.get("imageFile") as File;
    const description = formData.get("description") as string;

    if (!gpxFile || !imageFile) {
      return NextResponse.json(
        { error: "GPX file and image are required" },
        { status: 400 }
      );
    }

    // Create unique filenames
    const timestamp = Date.now();
    const gpxFilename = `${timestamp}-${gpxFile.name}`;
    const imageFilename = `${timestamp}-${imageFile.name}`;

    // Save files to public directory
    const publicDir = join(process.cwd(), "public");
    const routesDir = join(publicDir, "routes");

    // Save GPX file
    const gpxBuffer = Buffer.from(await gpxFile.arrayBuffer());
    await writeFile(join(routesDir, gpxFilename), gpxBuffer);

    // Save image file
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    await writeFile(join(routesDir, imageFilename), imageBuffer);

    // TODO: Save route metadata to a database or JSON file
    const routeData = {
      id: timestamp,
      name: gpxFile.name.replace(".gpx", ""),
      description,
      gpxFile: gpxFilename,
      imageFile: imageFilename,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(routeData);
  } catch (error) {
    console.error("Error uploading route:", error);
    return NextResponse.json(
      { error: "Failed to upload route" },
      { status: 500 }
    );
  }
}
