const mongoose = require("mongoose");
const Progress = require("../models/Progress.model");
const MockSession = require("../models/MockSession.model");

function uid(req) {
  return new mongoose.Types.ObjectId(req.userId);
}

function shuffle(rows) {
  const out = [...rows];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

async function startMock(req, res, next) {
  try {
    const count = Math.min(5, Math.max(3, Number(req.query.count) || 5));
    const durationMinutes = Math.min(45, Math.max(30, Number(req.query.durationMinutes) || 30));
    const rows = await Progress.find({ userId: uid(req) }).lean();
    const selected = shuffle(rows).slice(0, count);
    const questions = selected.map((r) => r.questionId);
    const session = await MockSession.create({
      userId: uid(req),
      questions,
      durationMinutes,
      startedAt: new Date(),
    });
    return res.json({
      sessionId: String(session._id),
      questions,
      durationMinutes,
      startedAt: session.startedAt,
    });
  } catch (err) {
    return next(err);
  }
}

async function submitMock(req, res, next) {
  try {
    const { sessionId, attempted = 0, correct = 0, timeTakenSeconds = 0 } = req.body || {};
    if (!sessionId) return res.status(400).json({ error: "sessionId is required" });
    const session = await MockSession.findOne({ _id: sessionId, userId: uid(req) });
    if (!session) return res.status(404).json({ error: "Mock session not found" });
    const attemptedCount = Math.min(session.questions.length, Math.max(0, Number(attempted) || 0));
    const correctCount = Math.min(attemptedCount, Math.max(0, Number(correct) || 0));
    const accuracy = attemptedCount ? Math.round((correctCount / attemptedCount) * 100) : 0;
    session.attemptedCount = attemptedCount;
    session.score = accuracy;
    session.completedAt = new Date();
    await session.save();
    return res.json({
      result: {
        totalQuestions: session.questions.length,
        attempted: attemptedCount,
        correct: correctCount,
        accuracy,
        timeTakenSeconds: Math.max(0, Number(timeTakenSeconds) || 0),
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  startMock,
  submitMock,
};
