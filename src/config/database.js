import mongoose from "mongoose";
const DB_URL = process.env.DB_URL;
export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://anshuman:Anshuman%40mongodb@cluster0.iuqrv.mongodb.net/connect?retryWrites=true&w=majority&appName=Cluster0"
    );
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};
