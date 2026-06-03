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
const requireAuth = require("../middleware/requireAuth");
const requireMongo = require("../middleware/requireMongo");
const { getWeakTopics } = require("../controllers/analytics.controller");
const { getTodayPlan } = require("../controllers/planner.controller");
const { getMe } = require("../controllers/user.controller");
const { getSubscriptionStatus } = require("../controllers/subscription.controller");
const {
  adaptiveSuggestions,
  mistakeInsights,
} = require("../controllers/smart.controller");

const router = express.Router();

function setCurrentUserParam(req, _res, next) {
  req.params.userId = req.userId;
  next();
}

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

router.get("/me", requireAuth, requireMongo, getMe);
router.get("/status", requireAuth, requireMongo, getSubscriptionStatus);
router.get("/weak-topics", requireAuth, requireMongo, setCurrentUserParam, getWeakTopics);
router.get("/today", requireAuth, requireMongo, setCurrentUserParam, getTodayPlan);
router.get("/suggestions", requireAuth, requireMongo, adaptiveSuggestions);
router.get("/mistakes", requireAuth, requireMongo, mistakeInsights);

router.get("/", (_req, res) => {
  res.json({ message: "PrepFlow API", version: "1" });
});

router.use("/", smartRoutes);

module.exports = router;
