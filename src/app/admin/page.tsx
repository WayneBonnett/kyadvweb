"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function AdminPage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, router]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // TODO: Implement actual file upload logic
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
          <p className="text-xl text-gray-600">
            Manage your GPX routes and blog content
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Upload New Route</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GPX File
            </label>
            <input
              type="file"
              accept=".gpx"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-red-50 file:text-red-700
                hover:file:bg-red-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Route Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-red-50 file:text-red-700
                hover:file:bg-red-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Route Description
            </label>
            <textarea
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              placeholder="Describe the route, including key points of interest, difficulty level, and estimated duration..."
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-red-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Upload Route
          </button>
        </div>
      </div>

      {/* Existing Routes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Existing Routes</h2>
        <div className="space-y-4">
          {/* Route list will be dynamically populated */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold">Sample Route</h3>
              <p className="text-sm text-gray-500">Last updated: 2024-03-20</p>
            </div>
            <div className="space-x-2">
              <button className="text-blue-600 hover:text-blue-700">
                Edit
              </button>
              <button className="text-red-600 hover:text-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
