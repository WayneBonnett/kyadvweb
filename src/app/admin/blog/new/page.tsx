"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function NewBlogPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create blog post");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error creating blog post:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create blog post. Please try again."
      );
    } finally {
      setIsSaving(false);
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
          <h1 className="text-3xl font-bold">Create New Blog Post</h1>
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
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Slug (optional)
            </label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="my-blog-post"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to generate from title
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Content
            </label>
            <div className="prose max-w-none">
              <ReactQuill
                value={content}
                onChange={setContent}
                className="h-96 mb-12"
                theme="snow"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
