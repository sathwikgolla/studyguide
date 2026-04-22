const jwt = require("jsonwebtoken");

/**
 * Requires `Authorization: Bearer <JWT>`. Sets `req.userId` (string) from payload.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Server misconfiguration" });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, secret);
    const uid = payload.userId || payload.sub;
    if (!uid) {
      return res.status(401).json({ error: "Invalid token payload" });
    }
    req.userId = String(uid);
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
