const express = require("express");
const userRoutes = require("./user.routes");
const progressRoutes = require("./progress.routes");
const questionRoutes = require("./question.routes");
const fullstackRoutes = require("./fullstack.routes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/progress", progressRoutes);
router.use("/questions", questionRoutes);
router.use("/fullstack", fullstackRoutes);

router.get("/", (_req, res) => {
  res.json({ message: "PrepFlow API", version: "1" });
});

module.exports = router;
