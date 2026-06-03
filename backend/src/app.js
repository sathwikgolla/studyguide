const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const authRoutes = require("./routes/auth.routes");
const questionRoutes = require("./routes/question.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : []),
]
  .filter(Boolean)
  .map((origin) => origin.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0) return callback(null, true);
      const normalized = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalized)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get(["/health", "/api/health"], (_req, res) => {
  res.json({
    ok: true,
    service: "PrepFlow API",
    mongodb:
      mongoose.connection.readyState === 1
        ? "connected"
        : mongoose.connection.readyState === 2
          ? "connecting"
          : "disconnected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes); // optional old support
app.use("/api", routes);
/** Alias for GET /questions (same handlers as /api/questions). */
app.use("/questions", questionRoutes);

app.use(errorHandler);

module.exports = app;
