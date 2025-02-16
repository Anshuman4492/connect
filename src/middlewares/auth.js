export const adminAuth = (req, res, next) => {
  const token = "token";
  const isAdmin = token === "token";
  if (!isAdmin) res.status(401).send("Unauthorized required");
  next();
};

export const userAuth = (req, res, next) => {
  const token = "token";
  const isUser = token === "token";
  if (!isUser) res.status(401).send("Unauthorized required");
  next();
};
