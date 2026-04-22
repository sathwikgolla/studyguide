const mongoose = require("mongoose");

const weeklyChallengeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    weekKey: { type: String, required: true, index: true },
    target: { type: Number, default: 20, min: 1 },
    completed: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

weeklyChallengeSchema.index({ userId: 1, weekKey: 1 }, { unique: true });

module.exports = mongoose.model("WeeklyChallenge", weeklyChallengeSchema);
