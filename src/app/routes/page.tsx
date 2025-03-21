"use client";

import { useState, useEffect } from "react";
import RouteMap from "@/components/RouteMap";
import RouteDetailsModal from "@/components/RouteDetailsModal";
import { AdventureIcons } from "@/components/AdventureIcons";

interface Route {
  name: string;
  description: string;
  date: string;
  downloadUrl: string;
  distance: string;
  elevation: {
    min: number;
    max: number;
    gain: number;
  };
}

export default function RoutesPage() {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch("/api/gpx");
      if (!response.ok) {
        throw new Error("Failed to fetch routes");
      }
      const data = await response.json();

      // Transform the GPX files into routes
      const transformedRoutes = data.files.map((file: any) => ({
        name: file.title,
        description: file.description || "No description available",
        date: new Date(file.uploadedAt).toLocaleDateString(),
        downloadUrl: `/content/gpx/${file.fileName}`,
        distance: "Distance will be calculated", // We'll need to parse the GPX file for this
        elevation: {
          min: 0,
          max: 0,
          gain: 0,
        },
      }));

      setRoutes(transformedRoutes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setError("Failed to load routes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-adventure mb-4">GPX Routes</h1>
        <p className="text-gray-600 mb-8">
          Download and explore motorcycle routes across Kentucky
        </p>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adventure"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!loading && !error && routes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No routes available yet. Check back soon!
            </p>
          </div>
        )}

        {!loading && !error && routes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <div
                key={route.name}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {route.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{route.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <AdventureIcons.Distance className="w-5 h-5 mr-2 text-green-700" />
                      <span className="text-sm text-gray-600">
                        {route.distance}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <AdventureIcons.Elevation className="w-5 h-5 mr-2 text-green-700" />
                      <span className="text-sm text-gray-600">
                        {route.elevation.min}ft - {route.elevation.max}ft
                      </span>
                    </div>
                    <div className="flex items-center">
                      <AdventureIcons.Mountain className="w-5 h-5 mr-2 text-green-700" />
                      <span className="text-sm text-gray-600">
                        {route.elevation.gain}ft gain
                      </span>
                    </div>
                    <div className="flex items-center">
                      <AdventureIcons.Weather className="w-5 h-5 mr-2 text-green-700" />
                      <span className="text-sm text-gray-600">
                        {route.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setSelectedRoute(route)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                    <a
                      href={route.downloadUrl}
                      download
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Download GPX
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedRoute && (
          <RouteDetailsModal
            route={selectedRoute}
            onClose={() => setSelectedRoute(null)}
          />
        )}
      </div>
    </div>
  );
}
