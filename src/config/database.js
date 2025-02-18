import mongoose from "mongoose";
const DB_URL = process.env.DB_URL;
export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL);
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
