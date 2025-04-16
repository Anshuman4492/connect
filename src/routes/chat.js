import express from "express";
import { userAuth } from "../middlewares/auth.js";
import Chat from "../models/chat.js";

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName profileImage",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json({
      chatId: chat._id,
      chat,
    });
  } catch (error) {
    console.log("Error fetching chat:", error);
  }
});

export default chatRouter;
