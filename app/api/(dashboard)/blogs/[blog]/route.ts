import { NextResponse } from "next/server";

import { getBlogById } from "@/data/blog";
import { getCategoryById } from "@/data/category";
import { getUserById } from "@/data/user";

import db from "@/lib/db";

interface BlogContext {
  params: {
    blog: string;
  };
}

export const GET = async (req: Request, context: BlogContext) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    if (!blogId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        { status: 400 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    const category = await getCategoryById(categoryId);

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found in the database" }),
        { status: 404 }
      );
    }

    const filter = await db.blog.findFirst({
      where: {
        userId,
        categoryId,
      },
    });

    const singleBlog = await getBlogById(blogId);

    if (!filter || !singleBlog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found in the database" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify({ blog: singleBlog }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(`Error in getting blogs: ${error}`, {
      status: 500,
    });
  }
};

export const PATCH = async (req: Request, context: BlogContext) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const body = await req.json();
    const { title, description, content } = body;

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!blogId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        { status: 400 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    const blog = await db.blog.findFirst({
      where: {
        userId,
        id: blogId,
      },
    });

    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found in the database" }),
        { status: 404 }
      );
    }

    const updatedBlog = await db.blog.update({
      where: {
        id: blogId,
      },
      data: {
        title,
        description,
        content,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Blog updated", updatedBlog }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(`Error in updating blog: ${error}`, {
      status: 500,
    });
  }
};

export const DELETE = async (req: Request, context: BlogContext) => {
  const blogId = context.params.blog;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!blogId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing blogId" }),
        { status: 400 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    const blog = await db.blog.findFirst({
      where: {
        userId,
        id: blogId,
      },
    });

    if (!blog) {
      return new NextResponse(
        JSON.stringify({ message: "Blog not found in the database" }),
        { status: 404 }
      );
    }

    await db.blog.delete({
      where: {
        id: blogId,
      },
    });

    return new NextResponse(JSON.stringify({ message: "Blog deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(`Error in deleting blog: ${error}`, {
      status: 500,
    });
  }
};
