const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const { toggleFavorite, getFavoritesByUserId } = require("../controllers/progress.controller");

const router = express.Router();

router.post("/toggle", requireAuth, requireMongo, toggleFavorite);
router.get("/:userId", requireAuth, requireMongo, getFavoritesByUserId);

module.exports = router;
