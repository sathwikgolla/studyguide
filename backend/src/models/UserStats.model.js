const mongoose = require("mongoose");

const userStatsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    xp: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1 },
    achievements: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserStats", userStatsSchema);
