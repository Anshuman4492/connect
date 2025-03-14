import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import {
  validateSignUpData,
  validateLoginData,
  validateForgotPasswordData,
} from "../utils/validation.js";

const authRouter = express.Router();

// Register a new user
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    validateLoginData(req);

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

    res.json({ message: "Login successful", data: validUser });
  } catch (error) {
    res.send(`Error:${error.message}`);
  }
});

// POST /logout
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful");
});

authRouter.post("/forgotpassword", async (req, res) => {
  try {
    if (!validateForgotPasswordData) throw new Error("Invalid email");
    const { email } = req.body;

    // Find user by provided email Id
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    // TO DO:: Send a email to user for resetting password
  } catch (error) {
    res.status(401).send(`Error:${error.message}`);
  }
});

export default authRouter;
