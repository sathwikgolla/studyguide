const jwt = require("jsonwebtoken");

function signUserToken(userId, options = {}) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  const expiresIn = options.expiresIn || process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ userId: String(userId) }, secret, { expiresIn });
}

module.exports = { signUserToken };
