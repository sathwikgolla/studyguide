const express = require("express");
const requireMongo = require("../middleware/requireMongo");
const { listQuestions } = require("../controllers/question.controller");

const router = express.Router();

router.get("/", requireMongo, listQuestions);

module.exports = router;
