"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UploadGPX() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
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
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a GPX file");
      return;
    }

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      console.log("Uploading file:", file.name);
      const response = await fetch("/api/gpx", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload GPX file");
      }

      console.log("Upload successful:", data);
      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error uploading GPX file:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to upload GPX file. Please try again."
      );
    } finally {
      setIsUploading(false);
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
          <h1 className="text-3xl font-bold">Upload GPX File</h1>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Back to Dashboard
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6"
        >
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              GPX File
            </label>
            <input
              type="file"
              id="file"
              accept=".gpx"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  console.log("Selected file:", selectedFile.name);
                  setFile(selectedFile);
                  setError(null);
                }
              }}
              className="w-full"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUploading || !file}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload GPX"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
