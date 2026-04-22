const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    targetCategory: { type: String, default: "dsa", trim: true },
    targetDays: { type: Number, default: 30, min: 1 },
    profile: { type: String, default: "general", trim: true },
    roadmap: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

goalSchema.index({ userId: 1, active: 1 });

module.exports = mongoose.model("Goal", goalSchema);
