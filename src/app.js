import express from "express";
import "dotenv/config";
import { adminAuth, userAuth } from "./middlewares/auth.js";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.js";
const app = express();
const PORT = 3000;

// Making JSON in req.body to JS object, so that we can read it
app.use(express.json());

// Register a new user
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(401).send(`Error creating user:${error.message}`);
  }
});

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
