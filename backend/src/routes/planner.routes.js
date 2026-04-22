const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const { getTodayPlan } = require("../controllers/planner.controller");

const router = express.Router();

router.get("/today/:userId", requireAuth, requireMongo, getTodayPlan);
router.get("/today", requireAuth, requireMongo, (req, _res, next) => {
  req.params.userId = req.userId;
  next();
}, getTodayPlan);

module.exports = router;
