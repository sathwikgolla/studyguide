const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const checkPremiumAccess = require("../middleware/checkPremiumAccess");
const {
  getRevisionQueue,
  updateRevision,
} = require("../controllers/revision.controller");

const router = express.Router();

router.get("/queue", requireAuth, requireMongo, checkPremiumAccess, getRevisionQueue);
router.post("/update", requireAuth, requireMongo, checkPremiumAccess, updateRevision);

module.exports = router;
