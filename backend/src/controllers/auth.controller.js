const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const { signUserToken } = require("../utils/token");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function validateCredentials(email, password) {
  if (!email || !password) {
    return "Email and password are required";
  }
  const norm = normalizeEmail(email);
  if (!EMAIL_RE.test(norm)) {
    return "Invalid email format";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must include at least one letter and one number";
  }
  return null;
}

async function signup(req, res, next) {
  try {
    const { email, password } = req.body;
    const validationError = validateCredentials(email, password);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const normEmail = normalizeEmail(email);
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email: normEmail, passwordHash });
    return res.status(201).json({ 
      message: "Account created successfully. Please log in.",
      userId: String(user._id) 
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normEmail }).select("+passwordHash");
    const ok = user && (await bcrypt.compare(password, user.passwordHash));
    if (!ok) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signUserToken(user._id);
    return res.json({ token, userId: String(user._id) });
  } catch (err) {
    return next(err);
  }
}

module.exports = { signup, login };
