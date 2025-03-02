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
export const validateLoginData = (req) => {
  const { email, password } = req.body;
  if (!email) throw new Error("Email is required");
  if (!validator.isEmail(email)) throw new Error("Invalid email");
  if (!password) throw new Error("Password is required");
};

// validate forgot password data
export const validateForgotPasswordData = (req) => {
  const { emailId } = req.body;
  if (!emailId || !validator.isEmail(emailId)) return false;
  return true;
};

// Validate Profile Edit data
export const validateProfileEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "profileUrl",
    "about",
    "skills",
  ];
  const isUpdateAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return isUpdateAllowed;
};

// Validate password edit data
export const validatePasswordEditData = (req) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) return false;
  return true;
};

// Validate sent connection request status
export const validateSentConnectionRequestStatus = (status) => {
  const allowedStatus = ["pass", "like"];
  return allowedStatus.includes(status);
};
