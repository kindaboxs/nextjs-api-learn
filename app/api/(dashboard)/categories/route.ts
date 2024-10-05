import { NextResponse } from "next/server";

import { getUserById } from "@/data/user";

import db from "@/lib/db";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 404,
        }
      );
    }

    const categories = await db.category.findMany({
      where: {
        userId,
      },
    });

    if (categories.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No categories found", categories }),
        {
          status: 200,
        }
      );
    }

    return new NextResponse(JSON.stringify({ categories: categories }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse(`Error in getting categories: ${error}`, {
      status: 500,
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 404,
        }
      );
    }

    const { title, description } = await req.json();
    const newCategory = await db.category.create({
      data: {
        userId: user.id,
        title,
        description,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Category has been created!", newCategory }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(`Error in creating category: ${error}`, {
      status: 500,
    });
  }
};
