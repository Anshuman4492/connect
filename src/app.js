import express from "express";
import bcrypt from "bcrypt";
import "dotenv/config";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { userAuth } from "./middlewares/auth.js";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
const app = express();
const PORT = 3000;

// Making JSON in req.body to JS object, so that we can read it
app.use(express.json());
// Making cookies to JS object, so that we can read it
app.use(cookieParser());

// Register a new user
app.post("/signup", async (req, res) => {
  try {
    // validate req body
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;
    // Encrypt the password entered by user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const ALLOWED_ADD_FIELDS = [
      "email",
      "firstName",
      "lastName",
      "password",
      "gender",
    ];
    const isCreationAllowed = Object.keys(req.body).every((key) =>
      ALLOWED_ADD_FIELDS.includes(key)
    );
    if (!isCreationAllowed) {
      throw new Error("Account creation not allowed for these fields");
    }
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(401).send(`Error creating user: -> ${error.message}`);
  }
});

// POST /login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLogInData(req);

    const validUser = await User.findOne({ email });
    if (!validUser) throw new Error("Invalid Credentials");
    const isPasswordCorrect = await validUser.validatePassword(password);

    if (!isPasswordCorrect) throw new Error("Invalid Credentials");
    // Set token in cookies
    // res.cookie("token", "Secret_Auth_Token");

    // Create a JsonWebToken for more security
    const token = await validUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.send("Login successful");
  } catch (error) {
    res.send(`Error:${error.message}`);
  }
});

// GET /profile
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("User not found");
    res.send(user);
  } catch (error) {
    res.send(`Error:${error.message}`);
  }
});

// POST /SendConnectionRequest
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("User not found");
    res.send(`${user.firstName} has sent connection request`);
  } catch (error) {
    res.send(`Error:${error.message}`);
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
