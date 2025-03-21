import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

// Verify authentication
async function verifyAuth() {
  const authCookie = cookies().get("auth");
  if (!authCookie) {
    return false;
  }
  return true;
}

// Get a single blog post
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const blogDir = path.join(process.cwd(), "public", "content", "blog");
    const filePath = path.join(blogDir, `${params.slug}.json`);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Read the file
    const content = await fs.readFile(filePath, "utf-8");
    const post = JSON.parse(content);

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Error reading blog post:", error);
    return NextResponse.json(
      { error: "Failed to read blog post" },
      { status: 500 }
    );
  }
}

// Update a blog post
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Verify authentication
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, slug } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const blogDir = path.join(process.cwd(), "public", "content", "blog");
    const oldFilePath = path.join(blogDir, `${params.slug}.json`);
    const newFilePath = path.join(blogDir, `${slug || params.slug}.json`);

    // Check if old file exists
    try {
      await fs.access(oldFilePath);
    } catch {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // If slug is changing, check if new file already exists
    if (slug && slug !== params.slug) {
      try {
        await fs.access(newFilePath);
        return NextResponse.json(
          { error: "A blog post with this slug already exists" },
          { status: 409 }
        );
      } catch {
        // New file doesn't exist, we can proceed
      }
    }

    // Read the old post to preserve creation date
    const oldContent = await fs.readFile(oldFilePath, "utf-8");
    const oldPost = JSON.parse(oldContent);

    const blogPost = {
      title,
      content,
      slug: slug || params.slug,
      createdAt: oldPost.createdAt,
      updatedAt: new Date().toISOString(),
    };

    // If slug is changing, delete the old file
    if (slug && slug !== params.slug) {
      await fs.unlink(oldFilePath);
    }

    // Write the updated post
    await fs.writeFile(newFilePath, JSON.stringify(blogPost, null, 2));

    return NextResponse.json({ success: true, post: blogPost });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// Delete a blog post
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Verify authentication
  const isAuthenticated = await verifyAuth();
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const blogDir = path.join(process.cwd(), "public", "content", "blog");
    const filePath = path.join(blogDir, `${params.slug}.json`);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Delete the file
    await fs.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
