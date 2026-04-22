const mongoose = require("mongoose");

const RESOURCE_TYPES = ["topic", "resource", "practice", "video"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

const fullstackItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, index: true },
    category: { type: String, required: true, trim: true, default: "Full Stack Development" },
    subcategory: { type: String, required: true, trim: true, index: true },
    topicGroup: { type: String, required: true, trim: true, index: true },
    title: { type: String, required: true, trim: true },
    order: { type: Number, default: 1, index: true },
    difficulty: { type: String, enum: DIFFICULTIES, required: true },
    description: { type: String, required: true, trim: true },
    resourceType: { type: String, enum: RESOURCE_TYPES, required: true },
    youtubeLink: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FullstackItem", fullstackItemSchema);
module.exports.RESOURCE_TYPES = RESOURCE_TYPES;
module.exports.DIFFICULTIES = DIFFICULTIES;
