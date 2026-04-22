const express = require("express");
const { signup, login } = require("../controllers/auth.controller");
const requireMongo = require("../middleware/requireMongo");

const router = express.Router();

router.post("/signup", requireMongo, signup);
router.post("/login", requireMongo, login);

module.exports = router;
