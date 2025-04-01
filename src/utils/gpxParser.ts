import { parseString } from "xml2js";
import { promisify } from "util";
import { promises as fs } from "fs";
import path from "path";

const parseStringAsync = promisify(parseString);

interface GPXPoint {
  $: {
    lat: string;
    lon: string;
  };
  ele?: string[];
  desc?: string[];
}

interface GPXTrack {
  trkseg: {
    trkpt: GPXPoint[];
  }[];
}

interface GPXData {
  gpx: {
    metadata?: Array<{
      name?: string[];
      desc?: string[];
    }>;
    trk?: Array<{
      trkseg?: Array<{
        trkpt?: GPXPoint[];
      }>;
    }>;
  };
}

export interface RouteInfo {
  name: string;
  description: string;
  date: string;
  downloadUrl: string;
  distance: number;
  elevation: {
    gain: number;
    loss: number;
    min: number;
    max: number;
  };
  coordinates: {
    lat: number;
    lng: number;
    ele: number;
  }[];
}

interface GPXMetadata {
  name: string;
  description: string;
  distance: string;
  elevation: {
    min: number;
    max: number;
    gain: number;
  };
}

const emptyTrack: GPXTrack = {
  trkseg: [
    {
      trkpt: [],
    },
  ],
};

export async function parseGPXFile(gpxContent: string): Promise<RouteInfo> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxContent, "text/xml");

  // Get route name
  const name =
    doc.querySelector("gpx > metadata > name")?.textContent || "Unnamed Route";

  // Get all track points
  const points: GPXPoint[] = [];
  const trackPoints = doc.querySelectorAll("trkpt");

  trackPoints.forEach((point) => {
    const lat = parseFloat(point.getAttribute("lat") || "0");
    const lon = parseFloat(point.getAttribute("lon") || "0");
    const ele = point.querySelector("ele")?.textContent;
    const time = point.querySelector("time")?.textContent;

    points.push({
      $: {
        lat: lat.toString(),
        lon: lon.toString(),
      },
      ele: ele ? [ele] : undefined,
      desc: time ? [time] : undefined,
    });
  });

  // Calculate route statistics
  let distance = 0;
  let elevationGain = 0;
  let elevationLoss = 0;
  let minElevation = Infinity;
  let maxElevation = -Infinity;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];

    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat =
      ((parseFloat(curr.$.lat) - parseFloat(prev.$.lat)) * Math.PI) / 180;
    const dLon =
      ((parseFloat(curr.$.lon) - parseFloat(prev.$.lon)) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((parseFloat(prev.$.lat) * Math.PI) / 180) *
        Math.cos((parseFloat(curr.$.lat) * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance += R * c;

    // Calculate elevation changes
    if (curr.ele && prev.ele) {
      const eleDiff = parseFloat(curr.ele[0]) - parseFloat(prev.ele[0]);
      if (eleDiff > 0) {
        elevationGain += eleDiff;
      } else {
        elevationLoss += Math.abs(eleDiff);
      }

      minElevation = Math.min(minElevation, parseFloat(curr.ele[0]));
      maxElevation = Math.max(maxElevation, parseFloat(curr.ele[0]));
    }
  }

  const coordinates = points.map((point) => ({
    lat: parseFloat(point.$.lat),
    lng: parseFloat(point.$.lon),
    ele: point.ele ? parseFloat(point.ele[0]) : 0,
  }));

  return {
    name,
    description: "",
    date: new Date().toISOString(),
    downloadUrl: "",
    distance: distance * 0.621371, // Convert to miles
    elevation: {
      min: minElevation === Infinity ? 0 : minElevation,
      max: maxElevation === -Infinity ? 0 : maxElevation,
      gain: elevationGain,
      loss: elevationLoss,
    },
    coordinates,
  };
}

export async function parseGPX(input: string): Promise<RouteInfo> {
  try {
    let content: string;

    // Check if input is a file path or GPX content
    if (input.includes("<?xml") || input.includes("<gpx")) {
      content = input;
    } else {
      content = await fs.readFile(input, "utf-8");
    }

    return new Promise((resolve, reject) => {
      parseString(content, (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        const gpx = result.gpx;
        const track = gpx.trk[0];
        const segments = track.trkseg;
        const points = segments[0].trkpt;

        // Calculate route statistics
        let totalDistance = 0;
        let elevationGain = 0;
        let elevationLoss = 0;
        let minElevation = Infinity;
        let maxElevation = -Infinity;
        const coordinates = points.map((point: any) => {
          const lat = parseFloat(point.$.lat);
          const lng = parseFloat(point.$.lon);
          const ele = point.ele ? parseFloat(point.ele[0]) : 0;

          // Update elevation stats
          minElevation = Math.min(minElevation, ele);
          maxElevation = Math.max(maxElevation, ele);

          return { lat, lng, ele };
        });

        // Calculate distance and elevation changes
        for (let i = 1; i < coordinates.length; i++) {
          const prev = coordinates[i - 1];
          const curr = coordinates[i];

          // Calculate distance using Haversine formula
          const R = 6371e3; // Earth's radius in meters
          const φ1 = (prev.lat * Math.PI) / 180;
          const φ2 = (curr.lat * Math.PI) / 180;
          const Δφ = ((curr.lat - prev.lat) * Math.PI) / 180;
          const Δλ = ((curr.lng - prev.lng) * Math.PI) / 180;

          const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          totalDistance += R * c;

          // Calculate elevation changes
          const eleDiff = curr.ele - prev.ele;
          if (eleDiff > 0) {
            elevationGain += eleDiff;
          } else {
            elevationLoss += Math.abs(eleDiff);
          }
        }

        // Get route metadata
        const name = track.name ? track.name[0] : path.basename(input, ".gpx");
        const description = track.desc ? track.desc[0] : "";
        const date = track.time ? track.time[0] : new Date().toISOString();

        resolve({
          name,
          description,
          date,
          downloadUrl: `/content/gpx/${path.basename(input)}`,
          distance: Math.round((totalDistance / 1000) * 100) / 100, // Convert to km
          elevation: {
            gain: Math.round(elevationGain),
            loss: Math.round(elevationLoss),
            min: Math.round(minElevation),
            max: Math.round(maxElevation),
          },
          coordinates,
        });
      });
    });
  } catch (error) {
    console.error("Error parsing GPX file:", error);
    throw error;
  }
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

function formatDistance(meters: number): string {
  const miles = meters / 1609.34;
  return `${miles.toFixed(1)} miles`;
}
