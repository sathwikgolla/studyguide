const express = require("express");
const userRoutes = require("./user.routes");
const progressRoutes = require("./progress.routes");
const questionRoutes = require("./question.routes");
const fullstackRoutes = require("./fullstack.routes");
const plannerRoutes = require("./planner.routes");
const analyticsRoutes = require("./analytics.routes");
const streakRoutes = require("./streak.routes");
const resumeRoutes = require("./resume.routes");
const favoritesRoutes = require("./favorites.routes");
const smartRoutes = require("./smart.routes");
const subscriptionRoutes = require("./subscription.routes");
const mockRoutes = require("./mock.routes");
const revisionRoutes = require("./revision.routes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/progress", progressRoutes);
router.use("/questions", questionRoutes);
router.use("/fullstack", fullstackRoutes);
router.use("/planner", plannerRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/streak", streakRoutes);
router.use("/resume", resumeRoutes);
router.use("/favorites", favoritesRoutes);
router.use("/subscription", subscriptionRoutes);
router.use("/mock", mockRoutes);
router.use("/revision", revisionRoutes);
router.use("/", smartRoutes);

router.get("/", (_req, res) => {
  res.json({ message: "PrepFlow API", version: "1" });
});

module.exports = router;
