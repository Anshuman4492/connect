import mongoose from "mongoose";

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["like", "pass", "accepted", "rejected", "blocked"],
        message: "Invalid status:{VALUE}",
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Validate if fromUserId and toUserId are not same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId))
    throw new Error("You cannot send connection request to yourself");
  next();
});

export const ConnectionRequest = mongoose.model(
  "Connection Request",
  connectionRequestSchema
);
