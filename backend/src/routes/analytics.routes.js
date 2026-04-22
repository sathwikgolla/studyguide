const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const {
  getWeakTopics,
  getProgressTimeline,
  getDistribution,
} = require("../controllers/analytics.controller");

const router = express.Router();

function setParamUser(req, _res, next) {
  req.params.userId = req.userId;
  next();
}

router.get("/weak-topics/:userId", requireAuth, requireMongo, getWeakTopics);
router.get("/progress/:userId", requireAuth, requireMongo, getProgressTimeline);
router.get("/distribution/:userId", requireAuth, requireMongo, getDistribution);
router.get("/weak-topics", requireAuth, requireMongo, setParamUser, getWeakTopics);
router.get("/progress", requireAuth, requireMongo, setParamUser, getProgressTimeline);
router.get("/distribution", requireAuth, requireMongo, setParamUser, getDistribution);

module.exports = router;
