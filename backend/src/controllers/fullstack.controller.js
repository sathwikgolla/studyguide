const FullstackItem = require("../models/FullstackItem.model");
const { fullstackSections, fullstackRoadmapItems } = require("../data/fullstackRoadmap.data");

async function listSections(_req, res, next) {
  try {
    return res.json({ sections: fullstackSections });
  } catch (err) {
    return next(err);
  }
}

async function listItems(req, res, next) {
  try {
    const { subcategory, topicGroup, difficulty, resourceType } = req.query;

    const query = {};
    if (subcategory) query.subcategory = String(subcategory).trim();
    if (topicGroup) query.topicGroup = String(topicGroup).trim();
    if (difficulty) query.difficulty = String(difficulty).trim();
    if (resourceType) query.resourceType = String(resourceType).trim();

    let items = [];
    try {
      items = await FullstackItem.find(query).sort({ subcategory: 1, topicGroup: 1, order: 1 }).lean();
    } catch {
      items = [];
    }

    if (!items.length) {
      items = fullstackRoadmapItems.filter((item) => {
        if (query.subcategory && item.subcategory !== query.subcategory) return false;
        if (query.topicGroup && item.topicGroup !== query.topicGroup) return false;
        if (query.difficulty && item.difficulty !== query.difficulty) return false;
        if (query.resourceType && item.resourceType !== query.resourceType) return false;
        return true;
      });
    }

    return res.json({ count: items.length, items });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listSections, listItems };
