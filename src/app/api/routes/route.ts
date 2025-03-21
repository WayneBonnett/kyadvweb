import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parseGPX } from "@/utils/gpxParser";

export async function GET() {
  try {
    const routesDir = path.join(process.cwd(), "public", "routes");
    const files = fs
      .readdirSync(routesDir)
      .filter((file) => file.endsWith(".gpx"));

    const routes = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(routesDir, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const stats = fs.statSync(filePath);

        try {
          const gpxData = await parseGPX(fileContent);
          return {
            name: gpxData.name || path.parse(file).name,
            description: gpxData.description || "No description available",
            date: stats.mtime.toLocaleDateString(),
            downloadUrl: `/routes/${file}`,
            distance: gpxData.distance,
            elevation: {
              min: gpxData.elevation.min,
              max: gpxData.elevation.max,
              gain: gpxData.elevation.gain,
            },
          };
        } catch (error) {
          console.error(`Error parsing GPX file ${file}:`, error);
          return null;
        }
      })
    );

    // Filter out any null values from failed parsing
    const validRoutes = routes.filter((route) => route !== null);

    return NextResponse.json(validRoutes);
  } catch (error) {
    console.error("Error reading routes:", error);
    return NextResponse.json(
      { error: "Failed to load routes" },
      { status: 500 }
    );
  }
}
