const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const authRoutes = require("./routes/auth.routes");
const questionRoutes = require("./routes/question.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", routes);
/** Alias for GET /questions (same handlers as /api/questions). */
app.use("/questions", questionRoutes);

app.get("/health", (_req, res) => {
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

app.use(errorHandler);

module.exports = app;
