const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const { updateStreak, getStreakByUserId } = require("../controllers/streak.controller");

const router = express.Router();

router.post("/update", requireAuth, requireMongo, updateStreak);
router.get("/:userId", requireAuth, requireMongo, getStreakByUserId);
router.get("/me", requireAuth, requireMongo, (req, _res, next) => {
  req.params.userId = req.userId;
  next();
}, getStreakByUserId);

module.exports = router;
