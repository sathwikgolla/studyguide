const User = require("../models/User.model");

async function listUsers(_req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers };
