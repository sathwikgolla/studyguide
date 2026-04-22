const mongoose = require("mongoose");

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: DIFFICULTIES,
    },
    link: {
      type: String,
      trim: true,
      default: undefined,
    },
    platform: {
      type: String,
      trim: true,
      default: undefined,
    },
  },
  { timestamps: true }
);

/** Dedupe when `link` is present (most DSA rows include a URL). */
questionSchema.index({ link: 1 }, { unique: true, sparse: true });

questionSchema.index({ topic: 1, difficulty: 1 });
questionSchema.index({ title: 1, topic: 1 });

module.exports = mongoose.model("Question", questionSchema);
module.exports.DIFFICULTIES = DIFFICULTIES;
