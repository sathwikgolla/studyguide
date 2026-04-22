const Streak = require("../models/Streak.model");

function utcDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

async function touchStreak(userId) {
  const now = new Date();
  const today = utcDayKey(now);

  const doc = await Streak.findOne({ userId });
  if (!doc) {
    return Streak.create({
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastActiveDate: today,
      lastActivityAt: now,
    });
  }

  const previous = doc.lastActiveDate;
  if (!previous) {
    doc.currentStreak = 1;
  } else if (previous !== today) {
    const prevDate = new Date(`${previous}T00:00:00.000Z`);
    const dayDiff = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - prevDate.getTime()) / 86400000);
    doc.currentStreak = dayDiff === 1 ? doc.currentStreak + 1 : 1;
  }

  doc.longestStreak = Math.max(doc.longestStreak || 0, doc.currentStreak || 0);
  doc.lastActiveDate = today;
  doc.lastActivityAt = now;
  await doc.save();
  return doc;
}

module.exports = { touchStreak, utcDayKey };
