const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const {
  getRevisionQueue,
  updateRevision,
} = require("../controllers/revision.controller");

const router = express.Router();

router.get("/queue", requireAuth, requireMongo, getRevisionQueue);
router.post("/update", requireAuth, requireMongo, updateRevision);

module.exports = router;
