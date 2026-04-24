const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const checkPremiumAccess = require("../middleware/checkPremiumAccess");
const { startMock, submitMock } = require("../controllers/mock.controller");

const router = express.Router();

router.get("/start", requireAuth, requireMongo, checkPremiumAccess, startMock);
router.post("/submit", requireAuth, requireMongo, checkPremiumAccess, submitMock);

module.exports = router;
