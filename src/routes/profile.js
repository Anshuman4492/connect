import express from "express";
import bcrypt, { hash } from "bcrypt";
import validator from "validator";
import { userAuth } from "../middlewares/auth.js";
import {
  validatePasswordEditData,
  validateProfileEditData,
} from "../utils/validation.js";
const profileRouter = express.Router();

// GET /profile/view
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("User not found");
    res.send(user);
  } catch (error) {
    res.send(`Error:${error.message}`);
  }
});

// POST /profile/edit
profileRouter.post("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) throw new Error("Invalid edit request");

    const loggedInUser = req.user;
    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field])
    );
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}'s profile got updated succesfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(401).send(`Error:${error.message}`);
  }
});

// POST /profile/password/edit
profileRouter.post("/profile/password/edit", userAuth, async (req, res) => {
  try {
    const isEditPasswordValid = validatePasswordEditData(req);
    if (!isEditPasswordValid) throw new Error("Invalid edit password request");
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    const loggedInUser = req.user;

    // Verify Current entered psssword
    const isCurrentPasswordCorrect = bcrypt.compare(
      currentPassword,
      loggedInUser.password
    );
    if (!isCurrentPasswordCorrect)
      throw new Error("Current Password is not correct");
    if (newPassword !== confirmNewPassword)
      throw new Error("Password did not match");

    if (!validator.isStrongPassword(newPassword))
      throw new Error("Password is not strong. Please choose different one.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = hashedPassword;
    await loggedInUser.save();

    res
      .status(200)
      .json({ message: "Password changes successfully", data: loggedInUser });
  } catch (error) {
    res.status(401).send(`Error:${error.message}`);
  }
});

export default profileRouter;
