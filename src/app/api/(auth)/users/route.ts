import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(users, { status: 201 });
  } catch (error) {
    return new NextResponse("Error in fetching users" + error, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();

    await connectDB();

    const newUser = new User(body);

    await newUser.save();

    return new NextResponse(
      JSON.stringify({ message: "User is created ", user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse("Error in creating users" + error, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();

    const { userId, newUsername } = body;

    await connectDB();

    if (!userId || !newUsername) {
      return new NextResponse(
        JSON.stringify({ message: "ID or username are required" }),
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid userId" }), {
        status: 400,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse(JSON.stringify({ message: "User notfound" }), {
        status: 400,
      });
    }

    return new NextResponse(
      JSON.stringify({
        message: "User updated successfully ",
        user: updatedUser,
      }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse("Error in updating users" + error, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    // validate userId
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "userId is required" }),
        { status: 400 }
      );
    }

    // validate if userId is a valid objectId
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid userId" }), {
        status: 400,
      });
    }

    await connectDB();

    // TODO

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
    return new NextResponse(JSON.stringify({ message: "User not found" }), {
      status: 404,
    });
}

   return new NextResponse(
     JSON.stringify({
       message: "User deleted successfully ",
     }),
     { status: 201 }
   );
  } catch (error) {
    return new NextResponse("Error in deleting user" + error, { status: 500 });
  }
};
