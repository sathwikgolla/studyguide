const mongoose = require("mongoose");
const Progress = require("../models/Progress.model");
const Question = require("../models/Question.model");

function toObjectId(id) {
  return new mongoose.Types.ObjectId(id);
}

function parseCategoryAndSheet(questionId) {
  const qid = String(questionId || "");
  if (qid.startsWith("https://") || qid.startsWith("http://")) {
    return { category: "dsa", sheet: "dsa" };
  }

  if (qid.includes("/os/") || qid.includes("os")) {
    return { category: "os", sheet: "os" };
  }
  if (qid.includes("/cn/") || qid.includes("cn")) {
    return { category: "cn", sheet: "cn" };
  }
  if (qid.includes("/dbms/") || qid.includes("dbms")) {
    return { category: "dbms", sheet: "dbms" };
  }
  if (qid.includes("fullstack") || qid.includes("full-stack")) {
    return { category: "fullstack", sheet: "fullstack" };
  }
  return { category: "other", sheet: "other" };
}

async function upsertProgress(req, res, next) {
  try {
    const { questionId, completed, notes, categoryId, sheetId } = req.body;

    if (questionId === undefined || questionId === null) {
      return res.status(400).json({ error: "questionId is required" });
    }
    const qid = String(questionId).trim();
    if (!qid) {
      return res.status(400).json({ error: "questionId cannot be empty" });
    }

    const hasCompleted = typeof completed === "boolean";
    const hasNotes = typeof notes === "string";
    if (!hasCompleted && !hasNotes) {
      return res.status(400).json({
        error: "Provide at least one of: completed (boolean), notes (string)",
      });
    }

    if (!mongoose.isValidObjectId(req.userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const userId = new mongoose.Types.ObjectId(req.userId);
    const $set = { userId, questionId: qid };
    if (hasCompleted) $set.completed = completed;
    if (hasNotes) $set.notes = notes;
    if (typeof categoryId === "string" && categoryId.trim()) $set.categoryId = categoryId.trim();
    if (typeof sheetId === "string" && sheetId.trim()) $set.sheetId = sheetId.trim();

    const doc = await Progress.findOneAndUpdate(
      { userId, questionId: qid },
      { $set },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.json({
      progress: {
        userId: String(doc.userId),
        questionId: doc.questionId,
        categoryId: doc.categoryId ?? null,
        sheetId: doc.sheetId ?? null,
        completed: doc.completed,
        notes: doc.notes,
        updatedAt: doc.updatedAt,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function getProgressByUserId(req, res, next) {
  try {
    const { userId: paramId } = req.params;
    if (String(req.userId) !== String(paramId)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (!mongoose.isValidObjectId(paramId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const userId = new mongoose.Types.ObjectId(paramId);
    const rows = await Progress.find({ userId })
      .sort({ updatedAt: -1 })
      .lean();

    const progress = rows.map((r) => ({
      userId: String(r.userId),
      questionId: r.questionId,
      categoryId: r.categoryId ?? null,
      sheetId: r.sheetId ?? null,
      completed: r.completed,
      notes: r.notes ?? "",
      updatedAt: r.updatedAt,
    }));

    return res.json({ progress });
  } catch (err) {
    return next(err);
  }
}

async function toggleProgress(req, res, next) {
  try {
    const { questionId, categoryId, sheetId } = req.body;
    if (questionId === undefined || questionId === null) {
      return res.status(400).json({ error: "questionId is required" });
    }

    const qid = String(questionId).trim();
    if (!qid) {
      return res.status(400).json({ error: "questionId cannot be empty" });
    }

    if (!mongoose.isValidObjectId(req.userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const userId = toObjectId(req.userId);
    const existing = await Progress.findOne({ userId, questionId: qid }).lean();
    const nextCompleted = !(existing?.completed);

    const doc = await Progress.findOneAndUpdate(
      { userId, questionId: qid },
      {
        $set: {
          completed: nextCompleted,
          userId,
          questionId: qid,
          ...(typeof categoryId === "string" && categoryId.trim()
            ? { categoryId: categoryId.trim() }
            : {}),
          ...(typeof sheetId === "string" && sheetId.trim() ? { sheetId: sheetId.trim() } : {}),
        },
      },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.json({
      progress: {
        userId: String(doc.userId),
        questionId: doc.questionId,
        categoryId: doc.categoryId ?? null,
        sheetId: doc.sheetId ?? null,
        completed: doc.completed,
        notes: doc.notes ?? "",
        updatedAt: doc.updatedAt,
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function getProgressSummary(req, res, next) {
  try {
    const { userId: paramId } = req.params;
    if (String(req.userId) !== String(paramId)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (!mongoose.isValidObjectId(paramId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const userId = toObjectId(paramId);
    const [rows, totalQuestions] = await Promise.all([
      Progress.find({ userId, completed: true }).select("questionId").lean(),
      Question.countDocuments({}),
    ]);

    const perCategory = {};
    const perSheet = {};

    for (const r of rows) {
      const category = r.categoryId || parseCategoryAndSheet(r.questionId).category;
      const sheet = r.sheetId || parseCategoryAndSheet(r.questionId).sheet;
      perCategory[category] = (perCategory[category] || 0) + 1;
      perSheet[sheet] = (perSheet[sheet] || 0) + 1;
    }

    return res.json({
      totalCompleted: rows.length,
      totalQuestions,
      perCategory,
      perSheet,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { upsertProgress, getProgressByUserId, toggleProgress, getProgressSummary };
