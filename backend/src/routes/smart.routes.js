const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const {
  adaptiveSuggestions,
  upsertGoal,
  getGoal,
  practiceTimer,
  revisionQueue,
  mistakeInsights,
  updateXp,
  getXp,
  weeklyChallenge,
} = require("../controllers/smart.controller");

const router = express.Router();

router.get("/adaptive/suggestions", requireAuth, requireMongo, adaptiveSuggestions);
router.get("/goals", requireAuth, requireMongo, getGoal);
router.post("/goals", requireAuth, requireMongo, upsertGoal);
router.post("/practice/timer", requireAuth, requireMongo, practiceTimer);
router.get("/revision", requireAuth, requireMongo, revisionQueue);
router.get("/analytics/mistakes", requireAuth, requireMongo, mistakeInsights);
router.post("/xp/update", requireAuth, requireMongo, updateXp);
router.get("/xp", requireAuth, requireMongo, getXp);
router.get("/weekly-challenge", requireAuth, requireMongo, weeklyChallenge);
router.post("/weekly-challenge", requireAuth, requireMongo, weeklyChallenge);

module.exports = router;
