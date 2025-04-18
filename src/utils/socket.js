import { Server } from "socket.io";
import { Server as p2p } from "socket.io-p2p-server";
import Chat from "../models/chat.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.use(p2p);

  io.on("connection", (socket) => {
    // Handle events
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(`User ${firstName} joined room ${roomId}`);

      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = [userId, targetUserId].sort().join("_");

          console.log(
            `User ${firstName} sent: ${text} message to room ${roomId}`
          );

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({ senderId: userId, text });
          await chat.save();

          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (error) {
          console.log("Error saving chat message:", error);
        }
      }
    );

    socket.on("joinVideoCall", ({ firstName, userId, targetUserId }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log(`User ${firstName} joined video call room ${roomId}`);

      socket.join(roomId);
      socket.to(roomId).emit("userJoined", { firstName, userId });
    });

    socket.on("signal", (to, data) => {
      io.to(to).emit("signal", { from: socket.id, data });
    });

    socket.on("offer", (offer, roomId) => {
      socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", (answer, roomId) => {
      socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice candidate", (candidate, roomId) => {
      socket.to(roomId).emit("ice candidate", candidate);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default initializeSocket;
