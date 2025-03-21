"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface GPXFile {
  title: string;
  description: string;
  fileName: string;
  originalName: string;
  uploadedAt: string;
}

export default function ManageGPX() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<GPXFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    fetch("/api/auth/check")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Not authenticated");
        }
        return res.json();
      })
      .then(() => {
        setIsLoading(false);
        fetchGPXFiles();
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  const fetchGPXFiles = async () => {
    try {
      const response = await fetch("/api/gpx");
      if (!response.ok) {
        throw new Error("Failed to fetch GPX files");
      }
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error("Error fetching GPX files:", error);
      setError("Failed to load GPX files");
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm("Are you sure you want to delete this GPX file?")) {
      return;
    }

    try {
      const response = await fetch(`/api/gpx/${fileName}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete GPX file");
      }

      // Refresh the list
      fetchGPXFiles();
    } catch (error) {
      console.error("Error deleting GPX file:", error);
      setError("Failed to delete GPX file");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage GPX Files</h1>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {files.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No GPX files uploaded yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.fileName}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {file.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {file.originalName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {file.description || "No description"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(file.fileName)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
