const mongoose = require("mongoose");
const Planner = require("../models/Planner.model");
const Progress = require("../models/Progress.model");
const UserStats = require("../models/UserStats.model");
const { utcDayKey } = require("../utils/streak");

function shuffle(rows) {
  const a = [...rows];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function profileFromStars(stars) {
  if (stars >= 300) return "Legend";
  if (stars >= 180) return "Master";
  if (stars >= 90) return "Expert";
  if (stars >= 40) return "Advanced";
  if (stars >= 15) return "Skilled";
  return "Rookie";
}

function mapKind(categoryId, row) {
  if (row.revisit || row.confusing) return "revision";
  if (categoryId === "dsa") return "dsa";
  return "core";
}

function buildDailyTasks(rows) {
  if (!rows.length) return [];
  const byCategory = new Map();
  for (const row of rows) {
    const key = row.categoryId || "other";
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key).push(row);
  }

  const preferredCategories = shuffle(
    [...byCategory.entries()]
      .filter(([, catRows]) => catRows.some((r) => !r.completed))
      .map(([category]) => category)
  );
  const fallbackCategories = shuffle(
    [...byCategory.keys()].filter((category) => !preferredCategories.includes(category))
  );
  const categoryOrder = [...preferredCategories, ...fallbackCategories];
  const used = new Set();
  const tasks = [];

  for (const categoryId of categoryOrder) {
    if (tasks.length >= 5) break;
    const pool = shuffle(byCategory.get(categoryId) || []);
    const uncompleted = pool.filter((r) => !r.completed && !used.has(r.questionId));
    const source = uncompleted.length ? uncompleted : pool.filter((r) => !used.has(r.questionId));
    const pick = source[0];
    if (!pick) continue;
    used.add(pick.questionId);
    tasks.push({
      questionId: pick.questionId,
      categoryId: pick.categoryId || "other",
      sheetId: pick.sheetId || "other",
      kind: mapKind(categoryId, pick),
    });
  }

  if (tasks.length < 5) {
    const remaining = shuffle(rows).filter((r) => !used.has(r.questionId));
    for (const row of remaining) {
      if (tasks.length >= 5) break;
      used.add(row.questionId);
      tasks.push({
        questionId: row.questionId,
        categoryId: row.categoryId || "other",
        sheetId: row.sheetId || "other",
        kind: mapKind(row.categoryId || "other", row),
      });
    }
  }

  return tasks.slice(0, 5);
}

async function getTodayPlan(req, res, next) {
  try {
    const { userId: paramId } = req.params;
    if (String(req.userId) !== String(paramId)) return res.status(403).json({ error: "Forbidden" });
    if (!mongoose.isValidObjectId(paramId)) return res.status(400).json({ error: "Invalid user id" });
    const userId = new mongoose.Types.ObjectId(paramId);
    const day = utcDayKey(new Date());

    let plan = await Planner.findOne({ userId, day });
    if (!plan) {
      const rows = await Progress.find({ userId }).lean();
      const tasks = buildDailyTasks(rows);
      plan = await Planner.findOneAndUpdate(
        { userId, day },
        { $set: { userId, day, tasks, rewardClaimed: false, completedAt: null, starsAwarded: 0 } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
      );
    }

    const taskIds = (plan.tasks || []).map((t) => t.questionId);
    const completedRows = taskIds.length
      ? await Progress.find({ userId, questionId: { $in: taskIds }, completed: true }, { questionId: 1 }).lean()
      : [];
    const completedSet = new Set(completedRows.map((r) => r.questionId));
    const tasks = (plan.tasks || []).map((task) => ({
      ...(task.toObject?.() || task),
      completed: completedSet.has(task.questionId),
    }));
    const completedCount = tasks.filter((t) => t.completed).length;
    const totalTasks = tasks.length;
    const allCompleted = totalTasks >= 5 && completedCount === totalTasks;

    let reward = null;
    if (allCompleted && !plan.rewardClaimed) {
      const starsEarned = 5;
      const stats = await UserStats.findOneAndUpdate(
        { userId },
        { $inc: { stars: starsEarned, xp: 50 }, $setOnInsert: { userId, level: 1, achievements: [], profileRank: "Rookie" } },
        { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
      );
      stats.profileRank = profileFromStars(stats.stars || 0);
      await stats.save();
      plan.rewardClaimed = true;
      plan.completedAt = new Date();
      plan.starsAwarded = starsEarned;
      await plan.save();
      reward = {
        starsEarned,
        xpEarned: 50,
        totalStars: stats.stars || 0,
        profileRank: stats.profileRank || "Rookie",
      };
    }

    let stats = await UserStats.findOne({ userId }).lean();
    if (!stats) {
      stats = { stars: 0, profileRank: "Rookie" };
    } else if (!stats.profileRank) {
      stats.profileRank = profileFromStars(stats.stars || 0);
    }

    return res.json({
      day,
      tasks,
      progress: {
        completedCount,
        totalTasks,
        allCompleted,
      },
      reward,
      profile: {
        stars: stats.stars || 0,
        rank: stats.profileRank || "Rookie",
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getTodayPlan };
