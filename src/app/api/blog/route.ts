import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

// Create blog posts directory if it doesn't exist
async function ensureBlogDirectory() {
  const blogDir = path.join(process.cwd(), "public", "content", "blog");
  try {
    await fs.access(blogDir);
  } catch {
    await fs.mkdir(blogDir, { recursive: true });
  }
  return blogDir;
}

export async function POST(request: Request) {
  // Verify authentication
  const authCookie = cookies().get("auth");
  if (!authCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, slug } = await request.json();

    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Title, content, and slug are required" },
        { status: 400 }
      );
    }

    const blogDir = await ensureBlogDirectory();
    const fileName = `${slug}.json`;
    const filePath = path.join(blogDir, fileName);

    // Check if file already exists
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { error: "A blog post with this slug already exists" },
        { status: 409 }
      );
    } catch {
      // File doesn't exist, we can proceed
    }

    const blogPost = {
      title,
      content,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(blogPost, null, 2));

    return NextResponse.json({ success: true, post: blogPost });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const blogDir = await ensureBlogDirectory();
    const files = await fs.readdir(blogDir);

    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          const content = await fs.readFile(path.join(blogDir, file), "utf-8");
          return JSON.parse(content);
        })
    );

    // Sort posts by creation date, newest first
    posts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
