import { connectDB } from "@/lib/db";
import Note from "@/lib/models/note";
import User from "@/lib/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

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

    const notes = await Note.find({ user: new Types.ObjectId(userId) });
    return NextResponse.json(notes, { status: 201 });
  } catch (error) {
    return new NextResponse("Error in fetching notes" + error, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    const body = await request.json();
    const { title, description } = body;

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

    const newNote = new Note({
      title,
      description,
      //   this pass only userId
      //   user: new Types.ObjectId(userId),
      user,
      // user:user =>should pass all info about user
    });

    await newNote.save();

    return new NextResponse(
      JSON.stringify({ message: "Note is created ", Note: newNote }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse("Error in creating notes" + error, { status: 500 });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");

    const body = await request.json();
    const { noteId, title, description } = body;

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
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, description },
      { new: true }
    );
    return new NextResponse(
      JSON.stringify({ message: "Note updated ", Note: updatedNote }),
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse("Error in updating notes" + error, { status: 500 });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const noteId = searchParams.get("noteId");

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

    await Note.findByIdAndDelete(noteId);
    return new NextResponse(JSON.stringify({ message: "Note deleted successfully" }), {
      status: 201,
    });
  } catch (error) {
    return new NextResponse("Error in deleting notes" + error, { status: 500 });
  }
};
