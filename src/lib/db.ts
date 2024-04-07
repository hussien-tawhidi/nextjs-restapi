import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    mongoose.connect(MONGODB_URI as string, {
      dbName: "NextjsRestApi",
      bufferCommands: false,
    });
    console.log("connected successfully");
  } catch (error) {
    console.log("Somthing went wrong with conneting database", error);
  }
};




