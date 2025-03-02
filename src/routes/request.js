import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { User } from "../models/user.js";
import {
  validateReviewConnectionRequest,
  validateSentConnectionRequestStatus,
} from "../utils/validation.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
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

      const existingConnectionRequest = await ConnectionRequest.findOne({
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
      const newConnectionRequest = new ConnectionRequest({
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

// POST /reviewConnectionRequest
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      // Validate status [accepted, rejected, blocked]
      const isStatusValid = validateReviewConnectionRequest(status);
      if (!isStatusValid) {
        return res.status(400).json({ message: `Invalid status:${status}` });
      }

      const loggedInUser = req.user;
      // validate requestId
      const validConnectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "like",
      });

      if (!validConnectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request not found" });
      }

      // Update connection request
      validConnectionRequest.status = status;
      await validConnectionRequest.save();

      res.status(200).json({
        message: `Connection request ${status} successfully`,
        data: validConnectionRequest,
      });
    } catch (error) {
      res.status(401).send(`Error:${error.message}`);
    }
  }
);

export default requestRouter;
