import Link from "next/link";
import { AdventureIcons } from "@/components/AdventureIcons";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-terrain flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <AdventureIcons.Trail className="w-16 h-16 text-adventure" />
        </div>
        <h1 className="text-4xl font-bold text-adventure mb-4">
          Blog Post Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The blog post you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center text-adventure hover:text-green-700 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </Link>
      </div>
    </main>
  );
}
