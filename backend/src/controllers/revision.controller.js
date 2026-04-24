const mongoose = require("mongoose");
const Progress = require("../models/Progress.model");

function uid(req) {
  return new mongoose.Types.ObjectId(req.userId);
}

function nextRevisionFromStage(stage) {
  const validStage = Math.max(1, Math.min(3, Number(stage) || 1));
  const daysMap = { 1: 1, 2: 3, 3: 7 };
  return new Date(Date.now() + daysMap[validStage] * 86400000);
}

async function getRevisionQueue(req, res, next) {
  try {
    const now = new Date();
    const queue = await Progress.find({
      userId: uid(req),
      $or: [{ revisit: true }, { nextRevisionDate: { $lte: now } }],
    })
      .sort({ nextRevisionDate: 1, updatedAt: -1 })
      .limit(50)
      .lean();
    return res.json({ queue });
  } catch (err) {
    return next(err);
  }
}

async function updateRevision(req, res, next) {
  try {
    const { questionId, stage = 1, completed = true } = req.body || {};
    if (!questionId) return res.status(400).json({ error: "questionId is required" });
    const qid = String(questionId).trim();
    if (!qid) return res.status(400).json({ error: "questionId cannot be empty" });
    const now = new Date();
    const nextRevisionDate = nextRevisionFromStage(stage);
    const doc = await Progress.findOneAndUpdate(
      { userId: uid(req), questionId: qid },
      {
        $set: {
          userId: uid(req),
          questionId: qid,
          lastAttempted: now,
          nextRevisionDate,
          revisit: !completed,
          completed: Boolean(completed),
          lastActivityAt: now,
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    return res.json({
      revision: {
        questionId: doc.questionId,
        lastAttempted: doc.lastAttempted,
        nextRevisionDate: doc.nextRevisionDate,
        revisit: doc.revisit,
        completed: doc.completed,
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getRevisionQueue,
  updateRevision,
};
