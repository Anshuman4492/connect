import express from "express";
import { userAuth } from "../middlewares/auth.js";

const requestRouter = express.Router();

// POST /SendConnectionRequest
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("User not found");
    res.send(`${user.firstName} has sent connection request`);
  } catch (error) {
    res.send(`Error:${error.message}`);
  }
});

export default requestRouter;
