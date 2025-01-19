import mongoose, { Schema, model } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MongoDB URI is missing!");
}

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected : ", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};
