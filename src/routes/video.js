import express from "express";
const videoRouter = express.Router();

videoRouter.post("/video/:targetUserId", async (req, res) => {
  const { targetUserId } = req.params;
});

export default videoRouter;
