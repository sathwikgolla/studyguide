const mongoose = require("mongoose");

const sheetSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    /** Optional stable key for URLs / imports (e.g. "top-interview", sheet index as string). */
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    /** Sort sheets within a category (lower first). */
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

sheetSchema.index({ category: 1, order: 1 });
sheetSchema.index({ category: 1, slug: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Sheet", sheetSchema);
