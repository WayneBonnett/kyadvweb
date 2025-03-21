import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RouteInfo } from "@/utils/gpxParser";

interface RouteMapProps {
  route: RouteInfo;
  className?: string;
}

export default function RouteMap({ route, className = "" }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [route.points[0].lon, route.points[0].lat],
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add route line when map loads
    map.current.on("load", () => {
      if (!map.current) return;

      // Add route line
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route.points.map((point) => [point.lon, point.lat]),
          },
        },
      });

      map.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ef4444",
          "line-width": 3,
        },
      });

      // Fit bounds to show entire route
      const bounds = new mapboxgl.LngLatBounds();
      route.points.forEach((point) => {
        bounds.extend([point.lon, point.lat]);
      });
      map.current.fitBounds(bounds, {
        padding: 50,
      });
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [route]);

  return (
    <div
      ref={mapContainer}
      className={`w-full h-[400px] rounded-lg overflow-hidden ${className}`}
    />
  );
}
