import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { AdventureIcons } from "@/components/AdventureIcons";
import Link from "next/link";

interface BlogPost {
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

function getBlogPost(slug: string): BlogPost | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "content",
      "blog",
      `${slug}.json`
    );
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading blog post:", error);
    return null;
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-terrain">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-adventure hover:text-green-700 transition-colors mb-8"
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

        <article className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-4">
            <AdventureIcons.Trail className="w-8 h-8 mr-3 text-adventure" />
            <h1 className="text-4xl font-bold text-adventure">{post.title}</h1>
          </div>

          <div className="flex items-center text-gray-500 mb-8">
            <span className="mr-4">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            {post.updatedAt !== post.createdAt && (
              <span className="text-sm">
                (Updated: {new Date(post.updatedAt).toLocaleDateString()})
              </span>
            )}
          </div>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </main>
  );
}
