const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const {
  getSubscriptionStatus,
  upgradeSubscription,
  createSubscriptionOrder,
  verifySubscriptionPayment,
} = require("../controllers/subscription.controller");

const router = express.Router();

router.get("/status", requireAuth, requireMongo, getSubscriptionStatus);
router.post("/upgrade", requireAuth, requireMongo, upgradeSubscription);
router.post("/create-order", requireAuth, requireMongo, createSubscriptionOrder);
router.post("/verify-payment", requireAuth, requireMongo, verifySubscriptionPayment);

module.exports = router;
