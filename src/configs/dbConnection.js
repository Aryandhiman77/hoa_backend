import mongoose from "mongoose";
import { MONGODB_URI } from "./index.js";

export async function connectDB() {
  try {
    const instance = await mongoose.connect(MONGODB_URI);
    console.log(`Connected to Database: ${instance.connection.host}`);
  } catch (error) {
    console.log("Error Connecting to DB:", error.message);
    process.exit(1);
  }
}
