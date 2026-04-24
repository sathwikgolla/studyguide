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

router.use(requireAuth, requireMongo);

router.get("/adaptive/suggestions", adaptiveSuggestions);
router.get("/goals", getGoal);
router.post("/goals", upsertGoal);
router.post("/practice/timer", practiceTimer);
router.get("/revision", revisionQueue);
router.get("/analytics/mistakes", mistakeInsights);
router.post("/xp/update", updateXp);
router.get("/xp", getXp);
router.get("/weekly-challenge", weeklyChallenge);
router.post("/weekly-challenge", weeklyChallenge);

module.exports = router;
