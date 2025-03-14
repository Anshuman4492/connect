import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.js";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import requestRouter from "./routes/request.js";
import userRouter from "./routes/user.js";
const app = express();
const PORT = 3000;

// Solve CORS Error
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Making JSON in req.body to JS object, so that we can read it
app.use(express.json());
// Making cookies to JS object, so that we can read it
app.use(cookieParser());

// Auth Router
app.use("/", authRouter);

// Profile Router
app.use("/", profileRouter);

// Request Router
app.use("/", requestRouter);

// User Router
app.use("/", userRouter);

// Get /user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const user = await User.findOne({ email: userEmail });
    res.send(user);
  } catch (error) {
    res.status(401).send(`Error getting user:${error.message}`);
  }
});

// Get /feed all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(401).send(`Error getting users:${error.message}`);
  }
});

// Get /user/:userId by id
app.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const userById = await User.findById(userId);
    res.send(userById);
  } catch (error) {
    res.status(401).send(`Error getting user by id:${error.message}`);
  }
});

// Delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(401).send(`Error deleting user:${error.message}`);
  }
});

// Update value to database, using userId
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const valueToUpdate = req.body;
  try {
    const ALLOWED_UPDATE_FIELDS = [
      "lastName",
      "password",
      "age",
      "skills",
      "gender",
      "profileUrl",
    ];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATE_FIELDS.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed for these fields");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const updateduser = await User.findByIdAndUpdate(userId, valueToUpdate, {
      returnDocument: "after",
    });
    res.send(`User updated successfully, ${updateduser}`);
  } catch (error) {
    res.status(401).send(`Error updating user:${error.message}`);
  }
});

// Update value to database, using email
app.patch("/user", async (req, res) => {
  const userEmail = req.body.email;
  const valueToUpdate = req.body;
  try {
    const ALLOWED_UPDATE_FIELDS = [
      "userEmail",
      "lastName",
      "password",
      "age",
      "skills",
      "gender",
      "profileUrl",
    ];
    const isUpdateAllowed = Object.keys(valueToUpdate).every((key) =>
      ALLOWED_UPDATE_FIELDS.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed for these fields");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findOneAndUpdate({ email: userEmail }, valueToUpdate);
    res.send("User updated successfully");
  } catch (error) {
    res.status(401).send(`Error updating user:${error.message}`);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to database successfully");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database", error);
  });
