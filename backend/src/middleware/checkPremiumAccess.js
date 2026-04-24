const User = require("../models/User.model");

async function checkPremiumAccess(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("plan").lean();
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (user.plan !== "premium") {
      return res.status(403).json({
        error: "Premium subscription required",
        code: "PREMIUM_REQUIRED",
      });
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = checkPremiumAccess;
