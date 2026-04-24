const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User.model");
const { signUserToken } = require("../utils/token");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASS_RULE_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const RESET_WINDOW_MS = 15 * 60 * 1000;

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function normalizeName(name) {
  return String(name || "").trim();
}

function validateCredentials(email, password) {
  if (!email || !password) return "Email and password are required";
  const norm = normalizeEmail(email);
  if (!EMAIL_RE.test(norm)) return "Invalid email format";
  return validatePassword(password);
}

function validatePassword(password) {
  if (!PASS_RULE_RE.test(password)) {
    return "Password must be 8+ chars and include uppercase, lowercase, number, and special character";
  }
  return null;
}

function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return null;
  return new OAuth2Client(clientId);
}

function issueResetToken() {
  const raw = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, hashed };
}

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const validationError = validateCredentials(email, password);
    if (validationError) return res.status(400).json({ error: validationError });
    const normEmail = normalizeEmail(email);
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: normalizeName(name) || normEmail.split("@")[0],
      email: normEmail,
      passwordHash,
      authProvider: "local",
      plan: "free",
    });
    return res.status(201).json({
      message: "Account created successfully. Please log in.",
      userId: String(user._id),
    });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: "Email already registered" });
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const normEmail = normalizeEmail(email);
    if (!EMAIL_RE.test(normEmail)) return res.status(400).json({ error: "Invalid email format" });
    const user = await User.findOne({ email: normEmail }).select("+passwordHash");
    if (!user || !user.passwordHash) return res.status(401).json({ error: "Invalid email or password" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });
    const token = signUserToken(user._id, { expiresIn: rememberMe ? "30d" : "12h" });
    return res.json({ token, userId: String(user._id), name: user.name || "" });
  } catch (err) {
    return next(err);
  }
}

async function googleLogin(req, res, next) {
  try {
    const { credential, rememberMe } = req.body;
    if (!credential) return res.status(400).json({ error: "Google credential is required" });
    const client = getGoogleClient();
    if (!client) return res.status(500).json({ error: "Google auth is not configured" });
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = normalizeEmail(payload?.email);
    if (!email || !payload?.sub) return res.status(400).json({ error: "Invalid Google token" });
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: normalizeName(payload.name) || email.split("@")[0],
        email,
        authProvider: "google",
        googleId: payload.sub,
        plan: "free",
      });
    } else if (!user.googleId || user.authProvider !== "google") {
      user.googleId = payload.sub;
      user.authProvider = "google";
      if (!user.name && payload.name) user.name = normalizeName(payload.name);
      await user.save();
    }
    const token = signUserToken(user._id, { expiresIn: rememberMe ? "30d" : "12h" });
    return res.json({ token, userId: String(user._id), name: user.name || "" });
  } catch {
    return res.status(401).json({ error: "Google authentication failed" });
  }
}

async function forgotPassword(req, res, next) {
  try {
    const email = normalizeEmail(req.body?.email);
    if (!EMAIL_RE.test(email)) return res.status(400).json({ error: "Invalid email format" });
    const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpires");
    if (user) {
      const { raw, hashed } = issueResetToken();
      user.resetPasswordToken = hashed;
      user.resetPasswordExpires = new Date(Date.now() + RESET_WINDOW_MS);
      await user.save();
      const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
      return res.json({
        message: "Password reset link generated.",
        resetToken: raw,
        resetUrl: `${frontendUrl}/reset-password?token=${raw}`,
      });
    }
    return res.json({
      message: "If an account exists for this email, a reset link has been created.",
    });
  } catch (err) {
    return next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    if (!token) return res.status(400).json({ error: "Reset token is required" });
    if (!password) return res.status(400).json({ error: "Password is required" });
    const validationError = validatePassword(password);
    if (validationError) return res.status(400).json({ error: validationError });
    const hashedToken = crypto.createHash("sha256").update(String(token)).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires +passwordHash");
    if (!user) return res.status(400).json({ error: "Reset token is invalid or expired" });
    user.passwordHash = await bcrypt.hash(password, 12);
    user.authProvider = "local";
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return res.json({ message: "Password reset successful. Please log in." });
  } catch (err) {
    return next(err);
  }
}

module.exports = { signup, login, googleLogin, forgotPassword, resetPassword };
