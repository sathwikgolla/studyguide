const mongoose = require("mongoose");
const Progress = require("../models/Progress.model");

async function getResume(req, res, next) {
  try {
    const { userId: paramId } = req.params;
    if (String(req.userId) !== String(paramId)) return res.status(403).json({ error: "Forbidden" });
    if (!mongoose.isValidObjectId(paramId)) return res.status(400).json({ error: "Invalid user id" });
    const userId = new mongoose.Types.ObjectId(paramId);

    const [lastActivity, rows] = await Promise.all([
      Progress.findOne({ userId }).sort({ lastActivityAt: -1, updatedAt: -1 }).lean(),
      Progress.find({ userId }).select("categoryId completed").lean(),
    ]);

    const perCategory = {};
    for (const r of rows) {
      const k = r.categoryId || "other";
      if (!perCategory[k]) perCategory[k] = { done: 0, total: 0 };
      perCategory[k].total += 1;
      if (r.completed) perCategory[k].done += 1;
    }
    const weakest = Object.entries(perCategory)
      .map(([categoryId, s]) => ({ categoryId, pct: s.total ? s.done / s.total : 0 }))
      .sort((a, b) => a.pct - b.pct)[0];

    return res.json({
      resume: {
        lastQuestionId: lastActivity?.questionId || null,
        lastCategoryId: lastActivity?.categoryId || null,
        suggestedCategoryId: weakest?.categoryId || "dsa",
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getResume };
