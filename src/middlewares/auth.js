import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
export const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Token not found");

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedToken;
    if (!_id) throw new Error("Invalid token");
    const user = await User.findById(_id);

    if (!user) throw new Error("User not found");
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(`Error:${error.message}`);
  }
};
