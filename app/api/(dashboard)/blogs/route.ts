import { NextResponse } from "next/server";

import { getUserById } from "@/data/user";

import db from "@/lib/db";
import { generateId } from "@/lib/id-generator";

export const GET = async (req: Request) => {
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

    const user = await getUserById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found in the database" }),
        { status: 404 }
      );
    }

    const filter: { userId: string; categoryId: string } = {
      userId,
      categoryId,
    };

    const blogs = await db.blog.findMany({
      where: filter,
    });

    return new NextResponse(JSON.stringify({ blogs }), { status: 200 });
  } catch (error) {
    return new NextResponse(`Error in getting blogs: ${error}`, {
      status: 500,
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    const body = await req.json();
    const { title, description, content } = body;

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

    const user = await getUserById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    const category = await db.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found in the database" }),
        { status: 404 }
      );
    }

    const newBlog = await db.blog.create({
      data: {
        id: generateId("blog_", 12),
        title,
        description,
        content,
        userId,
        categoryId,
      },
    });

    return new NextResponse(JSON.stringify({ newBlog }), { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return new NextResponse(
        JSON.stringify({
          message: "failed to create blog, please try again.",
        }),
        {
          status: 400,
        }
      );
    }

    return new NextResponse(`Error in creating blog: ${error}`, {
      status: 500,
    });
  }
};
