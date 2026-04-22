const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const {
  upsertProgress,
  getProgressByUserId,
  toggleProgress,
  getProgressSummary,
  toggleFavorite,
  getFavoritesByUserId,
} = require("../controllers/progress.controller");

const router = express.Router();

router.post("/", requireAuth, requireMongo, upsertProgress);
router.post("/notes/save", requireAuth, requireMongo, upsertProgress);
router.post("/toggle", requireAuth, requireMongo, toggleProgress);
router.post("/favorites/toggle", requireAuth, requireMongo, toggleFavorite);
router.get("/favorites/:userId", requireAuth, requireMongo, getFavoritesByUserId);
router.get("/summary/:userId", requireAuth, requireMongo, getProgressSummary);
router.get("/:userId", requireAuth, requireMongo, getProgressByUserId);

module.exports = router;
