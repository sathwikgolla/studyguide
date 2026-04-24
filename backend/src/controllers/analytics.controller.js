const mongoose = require("mongoose");
const Progress = require("../models/Progress.model");

function ensureAccess(req, paramId, res) {
  if (String(req.userId) !== String(paramId)) {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }
  if (!mongoose.isValidObjectId(paramId)) {
    res.status(400).json({ error: "Invalid user id" });
    return false;
  }
  return true;
}

async function getWeakTopics(req, res, next) {
  try {
    const { userId: paramId } = req.params;
    if (!ensureAccess(req, paramId, res)) return;
    const userId = new mongoose.Types.ObjectId(paramId);

    const rows = await Progress.find({ userId }).lean();
    const bucket = {};
    for (const row of rows) {
      const key = row.sheetId || row.categoryId || "other";
      if (!bucket[key]) bucket[key] = { topic: key, completed: 0, total: 0, pct: 0, lastActivityAt: row.lastActivityAt || row.updatedAt };
      bucket[key].total += 1;
      if (row.completed) bucket[key].completed += 1;
      const ts = row.lastActivityAt || row.updatedAt;
      if (ts && (!bucket[key].lastActivityAt || ts > bucket[key].lastActivityAt)) bucket[key].lastActivityAt = ts;
    }

    const weakTopics = Object.values(bucket)
      .map((b) => ({ ...b, pct: b.total ? Math.round((b.completed / b.total) * 100) : 0 }))
      .sort((a, b) => a.pct - b.pct)
      .slice(0, 5);

    return res.json({ weakTopics });
  } catch (err) {
    return next(err);
  }
}

async function getProgressTimeline(req, res, next) {
  try {
    const { userId: paramId } = req.params;
    if (!ensureAccess(req, paramId, res)) return;
    const userId = new mongoose.Types.ObjectId(paramId);
    const rows = await Progress.find({ userId, completed: true }).select("updatedAt").lean();

    const dayMap = {};
    for (const r of rows) {
      const day = new Date(r.updatedAt).toISOString().slice(0, 10);
      dayMap[day] = (dayMap[day] || 0) + 1;
    }

    const timeline = Object.entries(dayMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, solved]) => ({ day, solved }));

    return res.json({ timeline });
  } catch (err) {
    return next(err);
  }
}

async function getDistribution(req, res, next) {
  try {
    const { userId: paramId } = req.params;
    if (!ensureAccess(req, paramId, res)) return;
    const userId = new mongoose.Types.ObjectId(paramId);
    const rows = await Progress.find({ userId }).lean();
    const distribution = { Easy: 0, Medium: 0, Hard: 0 };
    for (const r of rows) {
      const text = String(r.questionId || "").toLowerCase();
      if (text.includes("easy")) distribution.Easy += 1;
      else if (text.includes("hard")) distribution.Hard += 1;
      else distribution.Medium += 1;
    }
    return res.json({ distribution });
  } catch (err) {
    return next(err);
  }
}

async function getAnalyticsOverview(req, res, next) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const rows = await Progress.find({ userId }).lean();
    const solvedRows = rows.filter((r) => r.completed);
    const timelineMap = {};
    for (const r of solvedRows) {
      const day = new Date(r.updatedAt).toISOString().slice(0, 10);
      timelineMap[day] = (timelineMap[day] || 0) + 1;
    }
    const timeline = Object.entries(timelineMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, solved]) => ({ day, solved }));
    const total = rows.length;
    const completed = solvedRows.length;
    return res.json({
      summary: {
        totalQuestions: total,
        completedQuestions: completed,
        completionRate: total ? Math.round((completed / total) * 100) : 0,
      },
      timeline,
    });
  } catch (err) {
    return next(err);
  }
}

async function getAnalyticsTopics(req, res, next) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const rows = await Progress.find({ userId }).lean();
    const bucket = {};
    for (const row of rows) {
      const topic = row.categoryId || row.sheetId || "other";
      if (!bucket[topic]) bucket[topic] = { topic, total: 0, completed: 0, completionPct: 0 };
      bucket[topic].total += 1;
      if (row.completed) bucket[topic].completed += 1;
    }
    const topics = Object.values(bucket).map((t) => ({
      ...t,
      completionPct: t.total ? Math.round((t.completed / t.total) * 100) : 0,
    }));
    const weakTopics = [...topics].sort((a, b) => a.completionPct - b.completionPct).slice(0, 6);
    return res.json({ topics, weakTopics });
  } catch (err) {
    return next(err);
  }
}

async function getAnalyticsDifficulty(req, res, next) {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const rows = await Progress.find({ userId }).lean();
    const difficulty = { Easy: 0, Medium: 0, Hard: 0 };
    for (const row of rows) {
      const text = String(row.questionId || "").toLowerCase();
      if (text.includes("easy")) difficulty.Easy += 1;
      else if (text.includes("hard")) difficulty.Hard += 1;
      else difficulty.Medium += 1;
    }
    return res.json({ difficulty });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getWeakTopics,
  getProgressTimeline,
  getDistribution,
  getAnalyticsOverview,
  getAnalyticsTopics,
  getAnalyticsDifficulty,
};
