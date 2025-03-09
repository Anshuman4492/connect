import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
const userRouter = express.Router();

const SAFE_USER_DATA = "firstName lastName profileUrl about skills";
// GET all pending connection requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingConnectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "like",
      // }).populate("fromUserId",["firstName","lastName","profileUrl","about","skills"]);
    }).populate("fromUserId", SAFE_USER_DATA);

    res
      .status(200)
      .json({ message: "Success", data: pendingConnectionRequests });
  } catch (error) {
    res.status(401).send(`Error:${error.message}`);
  }
});

// GET all user's connections
userRouter.get("/user/requests/connected", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate(
      loggedInUser._id.equals(fromUserId) ? "fromUserId" : "toUserId",
      SAFE_USER_DATA
    );

    const data = connections.map((connection) => connection.fromUserId);
    console.log(data);
    res.status(200).json({ message: "Success", data: data });
  } catch (error) {
    res.status(401).send(`Error:${error.message}`);
  }
});





export default userRouter;
