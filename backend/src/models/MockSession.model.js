const mongoose = require("mongoose");

const mockSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questions: {
      type: [String],
      default: [],
    },
    attemptedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    durationMinutes: {
      type: Number,
      default: 30,
      min: 1,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MockSession", mockSessionSchema);
