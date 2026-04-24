const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const {
  getSubscriptionStatus,
  upgradeSubscription,
} = require("../controllers/subscription.controller");

const router = express.Router();

router.get("/status", requireAuth, requireMongo, getSubscriptionStatus);
router.post("/upgrade", requireAuth, requireMongo, upgradeSubscription);

module.exports = router;
