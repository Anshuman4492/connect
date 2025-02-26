import validator from "validator";

export const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName) throw new Error("First name is required");
  if (!lastName) throw new Error("Last name is required");
  if (!email) throw new Error("Email is required");
  if (!validator.isEmail(email)) throw new Error("Invalid email");
  if (!password) throw new Error("Password is required");
  if (!validator.isStrongPassword(password))
    throw new Error("Password is not strong enough");
};
