import { NextResponse } from "next/server";

import { getUserByEmail, getUserById, getUserByUsername } from "@/data/user";

import db from "@/lib/db";

export const GET = async () => {
  try {
    const users = await db.user.findMany();
    return new NextResponse(JSON.stringify({ users: users }), { status: 200 });
  } catch (error) {
    return new NextResponse(`Error in fetching users: ${error}`, {
      status: 500,
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const { email, name, username, password } = await req.json();

    if (email || username) {
      if (await getUserByEmail(email)) {
        return new NextResponse(
          JSON.stringify({ message: "Email already exists" }),
          { status: 400 }
        );
      }

      if (await getUserByUsername(username)) {
        return new NextResponse(
          JSON.stringify({ message: "Username already exists" }),
          { status: 400 }
        );
      }
    }

    const newUser = await db.user.create({
      data: {
        email,
        name,
        username,
        password,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "User has been created!", newUser }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(`Error in creating user: ${error}`, {
      status: 500,
    });
  }
};

export const PATCH = async (req: Request) => {
  try {
    const { id, email, name, username, password } = await req.json();

    if (!id || !username) {
      return new NextResponse(
        JSON.stringify({ message: "Id or username not found" }),
        {
          status: 400,
        }
      );
    }

    if (!(await getUserById(id))) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        email,
        name,
        username,
        password,
      },
    });

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 404,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User has been updated!", updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(`Error in updating user: ${error}`, {
      status: 500,
    });
  }
};

export const DELETE = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse(JSON.stringify({ message: "Id not found" }), {
        status: 400,
      });
    }

    if (!(await getUserById(id))) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const deletedUser = await db.user.delete({ where: { id } });

    if (!deletedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 400,
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "User has been deleted!", deletedUser }),
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(`Error in deleting user: ${error}`, {
      status: 500,
    });
  }
};
