const mongoose = require("mongoose");

const streakSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActiveDate: {
      type: String,
      default: null,
    },
    lastActivityAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Streak", streakSchema);
