import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 0,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 6,
      maxLength: 20,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must have at least one lowercase, uppercase, number and special character"
          );
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 99,
      validate(value) {
        if (value < 18) {
          throw new Error("Age must be at least 18");
        }
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Invalid gender");
        }
      },
    },
    profileUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&s",
      maxLength: 200,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    skills: {
      type: [String],
      validate(value) {
        if (value?.length > 10) {
          throw new Error("Skills cannot be more than 10");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const passwordHash = this.password;
  const isPasswordCorrect = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordCorrect;
};

export const User = mongoose.model("User", userSchema);
