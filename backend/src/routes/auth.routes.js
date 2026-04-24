const express = require("express");
const rateLimit = require("express-rate-limit");
const { signup, login, googleLogin, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const requireMongo = require("../middleware/requireMongo");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 80,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts. Please try again later." },
});

router.post("/signup", authLimiter, requireMongo, signup);
router.post("/login", authLimiter, requireMongo, login);
router.post("/google", authLimiter, requireMongo, googleLogin);
router.post("/forgot-password", authLimiter, requireMongo, forgotPassword);
router.post("/reset-password", authLimiter, requireMongo, resetPassword);

module.exports = router;
