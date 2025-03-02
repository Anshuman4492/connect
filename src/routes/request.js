import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { User } from "../models/user.js";
import { validateSentConnectionRequestStatus } from "../utils/validation.js";
import { connectionRequest } from "../models/connectionRequest.js";
const requestRouter = express.Router();

// POST /SendConnectionRequest
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const toUserId = req.params.userId;

      // Validate if status is either 'like' or 'pass'
      const isStatusValid = validateSentConnectionRequestStatus(status);

      if (!isStatusValid)
        return res.status(400).json({ message: `Invalid status:${status}` });

      // Vaidate toUserId, it should be a valid user that exists on our DB
      const toUser = await User.findById(toUserId);
      if (!toUser)
        return res.status(400).json({
          message: "User not found, to whom you want to send the request",
        });

      // Validate request already present or not
      const fromUser = req.user;
      const fromUserId = fromUser._id;

      const existingConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Request already sent, you can't send it again" });
      }

      // Send connection request
      const newConnectionRequest = new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await newConnectionRequest.save();

      res.json({
        message: `${fromUser.firstName} sent a ${status} request to ${toUser.firstName}`,
        data: newConnectionRequest,
      });
    } catch (error) {
      res.status(401).send(`Error:${error.message}`);
    }
  }
);

export default requestRouter;
