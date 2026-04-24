const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },
    passwordHash: {
      type: String,
      required: function requiredPasswordHash() {
        return this.authProvider === "local";
      },
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    plan: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
