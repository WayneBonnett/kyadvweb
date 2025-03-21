import fs from "fs";
import path from "path";
import Link from "next/link";
import { AdventureIcons } from "@/components/AdventureIcons";

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

function getBlogPosts(): BlogPost[] {
  const postsDirectory = path.join(process.cwd(), "public", "content", "blog");
  try {
    const files = fs.readdirSync(postsDirectory);

    const posts = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => {
        const filePath = path.join(postsDirectory, file);
        const fileContent = fs.readFileSync(filePath, "utf8");
        const post = JSON.parse(fileContent);
        const slug = file.replace(".json", "");

        return {
          ...post,
          slug,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return posts;
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
}

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="min-h-screen bg-terrain">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-adventure mb-4">Blog</h1>
        <p className="text-gray-600 mb-8">
          Read about motorcycle adventures and route planning tips
        </p>

        <div className="grid gap-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <AdventureIcons.Trail className="w-6 h-6 mr-2 text-adventure" />
                <h2 className="text-2xl font-semibold text-adventure">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-green-700 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-4">
                <span className="mr-4">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {post.content.replace(/<[^>]*>/g, "").substring(0, 200)}...
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-adventure hover:text-green-700 transition-colors"
              >
                Read more
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
