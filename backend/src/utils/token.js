const jwt = require("jsonwebtoken");

function signUserToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ userId: String(userId) }, secret, { expiresIn });
}

module.exports = { signUserToken };
