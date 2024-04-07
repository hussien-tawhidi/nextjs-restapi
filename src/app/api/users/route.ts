import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();
    // return NextResponse.json({ message: "Topic created" }, { status: 201 });
    const users = await User.find();
    return NextResponse.json(users,{status:201});
  } catch (error) {
    return new NextResponse("Error in fetching users" + error, { status: 500 });
  }
};

export const POST = async (request:Request) => {
  try {
    
  } catch (error) {
    
  }
}
