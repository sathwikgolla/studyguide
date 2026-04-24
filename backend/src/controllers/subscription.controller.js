const crypto = require("crypto");
const Razorpay = require("razorpay");
const User = require("../models/User.model");

const PREMIUM_AMOUNT_INR = 99;

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

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

async function createSubscriptionOrder(req, res, next) {
  try {
    const client = getRazorpayClient();
    if (!client) {
      return res.status(500).json({ error: "Razorpay is not configured" });
    }
    const user = await User.findById(req.userId).select("email name plan").lean();
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (user.plan === "premium") {
      return res.json({
        alreadyPremium: true,
        plan: "premium",
        message: "You are already on Premium plan.",
      });
    }
    const amount = PREMIUM_AMOUNT_INR * 100;
    const receipt = `sub_${String(req.userId).slice(-8)}_${Date.now()}`;
    const order = await client.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: {
        userId: String(req.userId),
        plan: "premium",
      },
    });
    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      description: "PrepFlow Premium Monthly Subscription",
      customer: {
        name: user.name || "",
        email: user.email || "",
      },
      plan: "premium",
      monthlyPriceInr: PREMIUM_AMOUNT_INR,
    });
  } catch (err) {
    return next(err);
  }
}

async function verifySubscriptionPayment(req, res, next) {
  try {
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    } = req.body || {};
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ error: "Payment verification payload is incomplete" });
    }
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return res.status(500).json({ error: "Razorpay is not configured" });
    const generated = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    if (generated !== signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { plan: "premium" } },
      { new: true, runValidators: true }
    ).select("plan");
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    return res.json({
      message: "Payment verified. Premium activated successfully.",
      plan: user.plan,
      isPremium: user.plan === "premium",
      paymentId,
      orderId,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  getSubscriptionStatus,
  upgradeSubscription,
  createSubscriptionOrder,
  verifySubscriptionPayment,
};
