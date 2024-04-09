import { connectDB } from "@/lib/db";
import Note from "@/lib/models/note";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request, context: { params: any }) => {
  const noteId = context.params.note;
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    if (!noteId || !Types.ObjectId.isValid(noteId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing noteId" }),
        {
          status: 400,
        }
      );
    }
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "user is not found" }),
        { status: 400 }
      );
    }

    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) {
      return new NextResponse(
        JSON.stringify({ message: "Note not found or belong to this user" }),
        { status: 400 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Note deleted successfully", note }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new NextResponse("Error in deleting notes" + error, { status: 500 });
  }
};
