import { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import LineString from "ol/geom/LineString";
import { Style, Stroke } from "ol/style";
import { fromLonLat } from "ol/proj";
import { RouteInfo } from "@/utils/gpxParser";

interface RouteMapProps {
  route: RouteInfo;
  className?: string;
}

export default function RouteMap({ route, className = "" }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const vectorLayer = useRef<VectorLayer<VectorSource> | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create vector source and layer for the route
    const vectorSource = new VectorSource();
    vectorLayer.current = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "#ef4444",
          width: 3,
        }),
      }),
    });

    // Create the map
    map.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer.current,
      ],
      view: new View({
        center: fromLonLat([
          route.coordinates[0].lng,
          route.coordinates[0].lat,
        ]),
        zoom: 12,
      }),
    });

    // Add the route line
    const coordinates = route.coordinates.map((point) =>
      fromLonLat([point.lng, point.lat])
    );
    const routeFeature = new Feature({
      geometry: new LineString(coordinates),
    });
    vectorSource.addFeature(routeFeature);

    // Fit the view to show the entire route
    const extent = routeFeature.getGeometry()?.getExtent();
    if (extent) {
      map.current.getView().fit(extent, {
        padding: [50, 50, 50, 50],
      });
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.setTarget(undefined);
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
