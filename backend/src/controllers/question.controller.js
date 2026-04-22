const Question = require("../models/Question.model");

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * GET /api/questions
 * GET /api/questions?topic=Arrays — case-insensitive topic match (e.g. topic=Array for "Arrays" problems)
 */
async function listQuestions(req, res, next) {
  try {
    const { topic } = req.query;
    const filter = {};

    if (topic !== undefined && topic !== null && String(topic).trim() !== "") {
      const t = String(topic).trim();
      filter.topic = new RegExp(`^${escapeRegex(t)}$`, "i");
    }

    const questions = await Question.find(filter).sort({ topic: 1, title: 1 }).lean();
    res.json({ count: questions.length, questions });
  } catch (err) {
    next(err);
  }
}

module.exports = { listQuestions };
