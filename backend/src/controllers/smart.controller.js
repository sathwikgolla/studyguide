const mongoose = require("mongoose");
const Progress = require("../models/Progress.model");
const Goal = require("../models/Goal.model");
const UserStats = require("../models/UserStats.model");
const WeeklyChallenge = require("../models/WeeklyChallenge.model");
const Streak = require("../models/Streak.model");

function uid(req) {
  return new mongoose.Types.ObjectId(req.userId);
}

function weekKeyFrom(date = new Date()) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function categoryPath(categoryId) {
  const map = {
    dsa: "/dsa",
    os: "/os",
    cn: "/cn",
    dbms: "/dbms",
    fullstack: "/full-stack",
    aptitude: "/aptitude",
    "logical-reasoning": "/logical-reasoning",
    "system-design": "/system-design",
    "devops-cloud": "/devops-cloud",
    "hr-behavioral": "/hr-behavioral",
    "testing-qa": "/testing-qa",
    "design-patterns": "/design-patterns",
    "mobile-development": "/mobile-development",
    "web3-blockchain": "/web3-blockchain",
    "core-cs-fundamentals": "/core-cs-fundamentals",
  };
  return map[categoryId] || "/dsa";
}

async function adaptiveSuggestions(req, res, next) {
  try {
    const rows = await Progress.find({ userId: uid(req) }).lean();
    const avg = rows.length ? rows.reduce((a, r) => a + (r.successRate || 0), 0) / rows.length : 0;
    const preferredDifficulty = avg >= 0.7 ? "Hard" : avg <= 0.35 ? "Easy" : "Medium";
    const suggestions = rows
      .filter((r) => !r.completed)
      .sort((a, b) => (a.successRate || 0) - (b.successRate || 0))
      .slice(0, 5)
      .map((r) => ({
        questionId: r.questionId,
        categoryId: r.categoryId || "other",
        preferredDifficulty,
        modulePath: categoryPath(r.categoryId),
        sheetId: r.sheetId || null,
      }));
    return res.json({ preferredDifficulty, suggestions });
  } catch (err) {
    return next(err);
  }
}

async function upsertGoal(req, res, next) {
  try {
    const { title, targetCategory, targetDays, profile } = req.body;
    if (!title || !String(title).trim()) return res.status(400).json({ error: "title is required" });
    const roadmap = [
      `Week 1: fundamentals for ${targetCategory || "dsa"}`,
      `Week 2: medium drills and mocks`,
      `Week 3+: revision and targeted weaknesses`,
    ];
    const doc = await Goal.findOneAndUpdate(
      { userId: uid(req), active: true },
      { $set: { userId: uid(req), title: String(title).trim(), targetCategory, targetDays, profile, roadmap, active: true } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.json({ goal: doc });
  } catch (err) {
    return next(err);
  }
}

async function getGoal(req, res, next) {
  try {
    const goal = await Goal.findOne({ userId: uid(req), active: true }).lean();
    return res.json({ goal: goal || null });
  } catch (err) {
    return next(err);
  }
}

async function practiceTimer(req, res, next) {
  try {
    const { questionId, timeSeconds = 0, correct = true, categoryId, sheetId } = req.body;
    if (!questionId) return res.status(400).json({ error: "questionId is required" });
    const qid = String(questionId).trim();
    const existing = await Progress.findOne({ userId: uid(req), questionId: qid }).lean();
    const attempts = (existing?.attempts || 0) + 1;
    const incorrectCount = (existing?.incorrectCount || 0) + (correct ? 0 : 1);
    const successRate = attempts ? (attempts - incorrectCount) / attempts : 0;
    const avgTimeSeconds = attempts
      ? (((existing?.avgTimeSeconds || 0) * (attempts - 1)) + Number(timeSeconds || 0)) / attempts
      : Number(timeSeconds || 0);
    const now = new Date();
    const nextRevisionDate = new Date(now.getTime() + (correct ? 3 : 1) * 86400000);
    const doc = await Progress.findOneAndUpdate(
      { userId: uid(req), questionId: qid },
      {
        $set: {
          userId: uid(req),
          questionId: qid,
          categoryId: categoryId || existing?.categoryId,
          sheetId: sheetId || existing?.sheetId,
          attempts,
          incorrectCount,
          successRate,
          avgTimeSeconds,
          lastAttempted: now,
          lastActivityAt: now,
          nextRevisionDate,
          completed: correct ? true : Boolean(existing?.completed),
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.json({ practice: { questionId: doc.questionId, attempts: doc.attempts, successRate: doc.successRate, avgTimeSeconds: doc.avgTimeSeconds, nextRevisionDate: doc.nextRevisionDate } });
  } catch (err) {
    return next(err);
  }
}

async function revisionQueue(req, res, next) {
  try {
    const now = new Date();
    const queue = await Progress.find({
      userId: uid(req),
      $or: [{ revisit: true }, { nextRevisionDate: { $lte: now } }],
    })
      .sort({ nextRevisionDate: 1, updatedAt: -1 })
      .limit(30)
      .lean();
    return res.json({ queue });
  } catch (err) {
    return next(err);
  }
}

async function mistakeInsights(req, res, next) {
  try {
    const rows = await Progress.find({ userId: uid(req), incorrectCount: { $gt: 0 } }).lean();
    const byTopic = {};
    for (const r of rows) {
      const k = r.sheetId || r.categoryId || "other";
      byTopic[k] = (byTopic[k] || 0) + (r.incorrectCount || 0);
    }
    const insights = Object.entries(byTopic)
      .map(([topic, incorrectCount]) => ({ topic, incorrectCount }))
      .sort((a, b) => b.incorrectCount - a.incorrectCount)
      .slice(0, 6);
    return res.json({ insights });
  } catch (err) {
    return next(err);
  }
}

async function updateXp(req, res, next) {
  try {
    const { delta = 0 } = req.body;
    const inc = Number(delta) || 0;
    const doc = await UserStats.findOneAndUpdate(
      { userId: uid(req) },
      { $inc: { xp: inc }, $setOnInsert: { userId: uid(req), level: 1, achievements: [] } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    const [solvedCount, streak] = await Promise.all([
      Progress.countDocuments({ userId: uid(req), completed: true }),
      Streak.findOne({ userId: uid(req) }).lean(),
    ]);
    const level = Math.max(1, Math.floor((doc.xp || 0) / 100) + 1);
    const achievements = new Set(doc.achievements || []);
    if (level !== doc.level) {
      doc.level = level;
      achievements.add(`Reached level ${level}`);
    }
    if (solvedCount >= 25) achievements.add("Solved 25 questions");
    if (solvedCount >= 100) achievements.add("Solved 100 questions");
    if ((streak?.currentStreak || 0) >= 7) achievements.add("7-day streak");
    doc.achievements = [...achievements];
    await doc.save();
    return res.json({ xp: doc.xp, level: doc.level, achievements: doc.achievements });
  } catch (err) {
    return next(err);
  }
}

async function getXp(req, res, next) {
  try {
    let doc = await UserStats.findOne({ userId: uid(req) });
    if (!doc) {
      doc = await UserStats.create({ userId: uid(req), xp: 0, level: 1, achievements: [] });
    }
    const [solvedCount, streak] = await Promise.all([
      Progress.countDocuments({ userId: uid(req), completed: true }),
      Streak.findOne({ userId: uid(req) }).lean(),
    ]);
    const achievements = new Set(doc.achievements || []);
    if (solvedCount >= 25) achievements.add("Solved 25 questions");
    if (solvedCount >= 100) achievements.add("Solved 100 questions");
    if ((streak?.currentStreak || 0) >= 7) achievements.add("7-day streak");
    const computedLevel = Math.max(1, Math.floor((doc.xp || 0) / 100) + 1);
    if (computedLevel !== doc.level) achievements.add(`Reached level ${computedLevel}`);
    doc.level = computedLevel;
    doc.achievements = [...achievements];
    await doc.save();
    return res.json({
      xp: doc.xp || 0,
      level: doc.level || 1,
      achievements: doc.achievements || [],
    });
  } catch (err) {
    return next(err);
  }
}

async function weeklyChallenge(req, res, next) {
  try {
    const weekKey = weekKeyFrom();
    const { target = 20 } = req.body || {};
    const solvedThisWeek = await Progress.countDocuments({
      userId: uid(req),
      completed: true,
      updatedAt: { $gte: new Date(Date.now() - 7 * 86400000) },
    });
    const doc = await WeeklyChallenge.findOneAndUpdate(
      { userId: uid(req), weekKey },
      { $set: { userId: uid(req), weekKey, target: Number(target) || 20, completed: solvedThisWeek } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.json({ challenge: doc });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  adaptiveSuggestions,
  upsertGoal,
  getGoal,
  practiceTimer,
  revisionQueue,
  mistakeInsights,
  updateXp,
  getXp,
  weeklyChallenge,
};
