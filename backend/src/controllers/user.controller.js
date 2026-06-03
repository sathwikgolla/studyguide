const User = require("../models/User.model");

async function listUsers(_req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("name email plan createdAt updatedAt").lean();
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    return res.json({
      user: {
        id: String(user._id),
        name: user.name || "",
        email: user.email,
        plan: user.plan || "free",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { listUsers, getMe };
