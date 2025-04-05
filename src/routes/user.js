import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";
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
      $and: [
        { fromUserId: { $ne: loggedInUser._id } },
        { toUserId: { $ne: loggedInUser._id } },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    const data = connections.map((connection) => connection.fromUserId);
    res.status(200).json({ message: "Success", data: data });
  } catch (error) {
    res.status(401).send(`Error: => ${error.message}`);
  }
});

// GET /feed API
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // Limit (limit) to 50 -> Sanitize user request, so that it don't slows down the DB
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const loggedInUser = req.user;
    // Show profile, to which I have not sent and I have not received connection request
    // Find connection to which  have sent or recieved

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //  Hide these users from feed

    const hideUsersFromFeed = new Set();

    connections.forEach((connection) => {
      hideUsersFromFeed.add(connection.fromUserId);
      hideUsersFromFeed.add(connection.toUserId);
    });

    // Filter responses, which are not in hideUsersFromFeed

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SAFE_USER_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({ message: "Success", data: users });
  } catch (error) {
    res.status(401).json({ message: `Error:${error.message}` });
  }
});

export default userRouter;
