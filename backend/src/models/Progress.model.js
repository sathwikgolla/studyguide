const mongoose = require("mongoose");

/**
 * Per-user progress for a single question. `questionId` is a stable string
 * (e.g. problem URL or future Mongo ObjectId hex) — unique per question in the app.
 */
const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    questionId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4096,
    },
    categoryId: {
      type: String,
      trim: true,
      default: undefined,
      maxlength: 128,
      index: true,
    },
    sheetId: {
      type: String,
      trim: true,
      default: undefined,
      maxlength: 256,
      index: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
      maxlength: 50000,
    },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
