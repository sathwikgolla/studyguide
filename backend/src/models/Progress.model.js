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
    revisit: {
      type: Boolean,
      default: false,
      index: true,
    },
    important: {
      type: Boolean,
      default: false,
      index: true,
    },
    confusing: {
      type: Boolean,
      default: false,
      index: true,
    },
    favorite: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
    incorrectCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    successRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    lastAttempted: {
      type: Date,
      default: null,
      index: true,
    },
    nextRevisionDate: {
      type: Date,
      default: null,
      index: true,
    },
    avgTimeSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    companyTags: {
      type: [String],
      default: [],
    },
    conceptTags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, questionId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
