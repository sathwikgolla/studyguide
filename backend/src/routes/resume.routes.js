const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const { getResume } = require("../controllers/resume.controller");

const router = express.Router();

router.get("/:userId", requireAuth, requireMongo, getResume);
router.get("/", requireAuth, requireMongo, (req, _res, next) => {
  req.params.userId = req.userId;
  next();
}, getResume);

module.exports = router;
