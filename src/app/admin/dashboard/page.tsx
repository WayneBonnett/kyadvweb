"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/admin/login");
            }}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blog Posts Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
            <div className="space-y-4">
              <Link
                href="/admin/blog/new"
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Create New Post
              </Link>
              <Link
                href="/admin/blog"
                className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Manage Posts
              </Link>
            </div>
          </div>

          {/* GPX Files Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">GPX Files</h2>
            <div className="space-y-4">
              <Link
                href="/admin/gpx/new"
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Upload GPX File
              </Link>
              <Link
                href="/admin/gpx"
                className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded hover:bg-gray-700 transition"
              >
                Manage GPX Files
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
