const mongoose = require("mongoose");
const Streak = require("../models/Streak.model");
const { touchStreak } = require("../utils/streak");

async function updateStreak(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }
    const userId = new mongoose.Types.ObjectId(req.userId);
    const doc = await touchStreak(userId);
    return res.json({
      streak: {
        currentStreak: doc.currentStreak,
        longestStreak: doc.longestStreak,
        lastActivityAt: doc.lastActivityAt,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function getStreakByUserId(req, res, next) {
  try {
    const { userId: paramId } = req.params;
    if (String(req.userId) !== String(paramId)) return res.status(403).json({ error: "Forbidden" });
    if (!mongoose.isValidObjectId(paramId)) return res.status(400).json({ error: "Invalid user id" });
    const userId = new mongoose.Types.ObjectId(paramId);
    const doc = await Streak.findOne({ userId }).lean();
    return res.json({
      streak: {
        currentStreak: doc?.currentStreak || 0,
        longestStreak: doc?.longestStreak || 0,
        lastActivityAt: doc?.lastActivityAt || null,
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { updateStreak, getStreakByUserId };
