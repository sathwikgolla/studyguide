const User = require("../models/User.model");

async function getSubscriptionStatus(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("plan").lean();
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    return res.json({
      plan: user.plan || "free",
      isPremium: user.plan === "premium",
    });
  } catch (err) {
    return next(err);
  }
}

async function upgradeSubscription(req, res, next) {
  try {
    const requestedPlan = String(req.body?.plan || "premium").toLowerCase();
    if (!["free", "premium"].includes(requestedPlan)) {
      return res.status(400).json({ error: "Invalid plan" });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { plan: requestedPlan } },
      { new: true, runValidators: true }
    ).select("plan");
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    return res.json({
      message:
        requestedPlan === "premium"
          ? "Premium activated successfully."
          : "Plan switched to free.",
      plan: user.plan,
      isPremium: user.plan === "premium",
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getSubscriptionStatus,
  upgradeSubscription,
};
