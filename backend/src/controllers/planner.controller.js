const mongoose = require("mongoose");
const Planner = require("../models/Planner.model");
const Progress = require("../models/Progress.model");
const { utcDayKey } = require("../utils/streak");

function pickOne(rows, used) {
  const filtered = rows.filter((r) => !used.has(r.questionId));
  if (!filtered.length) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

async function getTodayPlan(req, res, next) {
  try {
    const { userId: paramId } = req.params;
    if (String(req.userId) !== String(paramId)) return res.status(403).json({ error: "Forbidden" });
    if (!mongoose.isValidObjectId(paramId)) return res.status(400).json({ error: "Invalid user id" });
    const userId = new mongoose.Types.ObjectId(paramId);
    const day = utcDayKey(new Date());

    let plan = await Planner.findOne({ userId, day }).lean();
    if (!plan) {
      const rows = await Progress.find({ userId }).lean();
      const used = new Set();
      const dsaPool = rows.filter((r) => r.categoryId === "dsa" && !r.completed);
      const conceptPool = rows.filter(
        (r) => ["os", "cn", "dbms"].includes(r.categoryId) && !r.completed
      );
      const revisionPool = rows.filter((r) => r.revisit || r.confusing || (r.completed && r.important));

      const tasks = [];
      const dsaA = pickOne(dsaPool, used);
      if (dsaA) {
        tasks.push({ questionId: dsaA.questionId, categoryId: dsaA.categoryId || "dsa", sheetId: dsaA.sheetId || "dsa", kind: "dsa" });
        used.add(dsaA.questionId);
      }
      const dsaB = pickOne(dsaPool, used);
      if (dsaB) {
        tasks.push({ questionId: dsaB.questionId, categoryId: dsaB.categoryId || "dsa", sheetId: dsaB.sheetId || "dsa", kind: "dsa" });
        used.add(dsaB.questionId);
      }
      const concept = pickOne(conceptPool, used);
      if (concept) {
        tasks.push({
          questionId: concept.questionId,
          categoryId: concept.categoryId || "other",
          sheetId: concept.sheetId || "other",
          kind: "core",
        });
        used.add(concept.questionId);
      }
      const revision = pickOne(revisionPool, used);
      if (revision) {
        tasks.push({
          questionId: revision.questionId,
          categoryId: revision.categoryId || "other",
          sheetId: revision.sheetId || "other",
          kind: "revision",
        });
      }

      plan = await Planner.findOneAndUpdate(
        { userId, day },
        { $set: { userId, day, tasks } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
      ).lean();
    }

    return res.json({ day, tasks: plan.tasks ?? [] });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getTodayPlan };
