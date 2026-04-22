const mongoose = require("mongoose");

const plannerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    day: {
      type: String,
      required: true,
      index: true,
    },
    tasks: [
      {
        questionId: { type: String, required: true },
        categoryId: { type: String, default: "other" },
        sheetId: { type: String, default: "other" },
        kind: { type: String, enum: ["dsa", "core", "revision"], default: "core" },
      },
    ],
  },
  { timestamps: true }
);

plannerSchema.index({ userId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model("Planner", plannerSchema);
