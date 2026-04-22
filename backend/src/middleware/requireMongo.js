const mongoose = require("mongoose");

/**
 * Ensures MongoDB is connected before running auth / DB routes.
 * Avoids opaque Mongoose errors and gives a clear message when DB is down.
 */
function requireMongo(req, res, next) {
  const state = mongoose.connection.readyState;
  if (state === 1) return next();
  if (state === 2) {
    return res.status(503).json({
      error: "Database is connecting. Wait a few seconds and try again.",
    });
  }
  return res.status(503).json({
    error:
      "Database is not connected. Start MongoDB, set MONGODB_URI in backend/.env, then restart the API.",
  });
}

module.exports = requireMongo;
