import express from "express";
import { adminAuth, userAuth } from "./middlewares/auth.js";

const app = express();
const PORT = 3000;

app.use("/admin", adminAuth);
app.use("/admin/dashboard", (req, res) => {
  res.send("Here is admin dashboard");
});
app.use("/admin/users", (req, res) => {
  res.send("Here is all users");
});
app.use("/user", userAuth, (req, res) => {
  res.send("Here is user dashboard");
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
