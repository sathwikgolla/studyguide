const mongoose = require("mongoose");

const CATEGORY_SLUGS = ["dsa", "os", "cn", "dbms", "fullstack"];

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      enum: CATEGORY_SLUGS,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
module.exports.CATEGORY_SLUGS = CATEGORY_SLUGS;
