import { connectDB } from "@/lib/db";
import Note from "@/lib/models/note";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  try {
   

    await connectDB();


    const notes = await Note.find();
    return NextResponse.json(notes, { status: 201 });
  } catch (error) {
    return new NextResponse("Error in fetching notes" + error, { status: 500 });
  }
};
