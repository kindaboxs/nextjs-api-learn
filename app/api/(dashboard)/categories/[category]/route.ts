import { NextRequest, NextResponse } from "next/server";

import { getUserById } from "@/data/user";

import db from "@/lib/db";

interface Context {
  params: {
    category: string;
  };
}

export const PATCH = async (req: NextRequest, context: Context) => {
  const categoryId = context.params.category;

  try {
    const body = await req.json();
    const { title, description } = body;

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found" }),
        { status: 404 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        { status: 404 }
      );
    }

    const findCategory = await db.category.findFirst({
      where: {
        id: categoryId,
        userId: userId,
      },
    });

    if (!findCategory) {
      return new NextResponse(
        JSON.stringify({ message: "Category not found in the database" }),
        { status: 404 }
      );
    }

    const updatedCategory = await db.category.update({
      where: { id: categoryId },
      data: {
        title,
        description,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "Category has been updated!",
        updatedCategory,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(`Error in updating category: ${error}`, {
      status: 500,
    });
  }
};
