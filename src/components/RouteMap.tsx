import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RouteInfo } from "@/utils/gpxParser";

interface RouteMapProps {
  route: RouteInfo;
  className?: string;
}

export default function RouteMap({ route, className = "" }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const routeLayer = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map
    map.current = L.map(mapRef.current).setView(
      [route.coordinates[0].lat, route.coordinates[0].lng],
      12
    );

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map.current);

    // Create the route line
    const coordinates = route.coordinates.map((point) => [
      point.lat,
      point.lng,
    ]);
    routeLayer.current = L.polyline(coordinates as L.LatLngExpression[], {
      color: "#ef4444",
      weight: 3,
    }).addTo(map.current);

    // Fit the map to show the entire route
    map.current.fitBounds(routeLayer.current.getBounds());

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [route]);

  return (
    <div
      ref={mapRef}
      className={`w-full h-[400px] rounded-lg overflow-hidden ${className}`}
    />
  );
}
