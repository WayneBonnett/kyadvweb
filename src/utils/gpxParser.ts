import { parseString } from "xml2js";
import { promisify } from "util";

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

interface RouteInfo {
  name: string;
  distance: number;
  elevation: {
    min: number;
    max: number;
    gain: number;
  };
  duration: number;
  points: GPXPoint[];
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
  let minElevation = Infinity;
  let maxElevation = -Infinity;
  let duration = 0;

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
      }

      minElevation = Math.min(minElevation, parseFloat(curr.ele[0]));
      maxElevation = Math.max(maxElevation, parseFloat(curr.ele[0]));
    }

    // Calculate duration if timestamps are available
    if (curr.desc && prev.desc) {
      const currTime = new Date(curr.desc[0]).getTime();
      const prevTime = new Date(prev.desc[0]).getTime();
      duration += (currTime - prevTime) / 1000; // Convert to seconds
    }
  }

  return {
    name,
    distance: distance * 0.621371, // Convert to miles
    elevation: {
      min: minElevation === Infinity ? 0 : minElevation,
      max: maxElevation === -Infinity ? 0 : maxElevation,
      gain: elevationGain,
    },
    duration: duration / 3600, // Convert to hours
    points,
  };
}

export async function parseGPX(gpxContent: string): Promise<GPXMetadata> {
  try {
    const result = (await parseStringAsync(gpxContent)) as GPXData;
    const gpx = result.gpx;
    const metadata = gpx.metadata?.[0] || {};
    const trk = gpx.trk?.[0] || {};
    const trkseg = trk.trkseg?.[0] || {};
    const trkpts = trkseg.trkpt || [];

    // Extract name and description
    const name = metadata.name?.[0] || "";
    const description = metadata.desc?.[0] || "";

    // Calculate distance and elevation
    let totalDistance = 0;
    let minElevation = Infinity;
    let maxElevation = -Infinity;
    let elevationGain = 0;
    let previousElevation = 0;

    for (let i = 0; i < trkpts.length; i++) {
      const pt = trkpts[i];
      const lat = parseFloat(pt.$.lat);
      const lon = parseFloat(pt.$.lon);
      const ele = parseFloat(pt.ele?.[0] || "0");

      // Update elevation stats
      minElevation = Math.min(minElevation, ele);
      maxElevation = Math.max(maxElevation, ele);
      if (i > 0 && ele > previousElevation) {
        elevationGain += ele - previousElevation;
      }
      previousElevation = ele;

      // Calculate distance between points
      if (i > 0) {
        const prevPt = trkpts[i - 1];
        const prevLat = parseFloat(prevPt.$.lat);
        const prevLon = parseFloat(prevPt.$.lon);
        totalDistance += calculateDistance(lat, lon, prevLat, prevLon);
      }
    }

    return {
      name,
      description,
      distance: formatDistance(totalDistance),
      elevation: {
        min: Math.round(minElevation),
        max: Math.round(maxElevation),
        gain: Math.round(elevationGain),
      },
    };
  } catch (error) {
    console.error("Error parsing GPX:", error);
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
