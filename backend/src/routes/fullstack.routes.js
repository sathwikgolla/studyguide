const express = require("express");
const { listSections, listItems } = require("../controllers/fullstack.controller");

const router = express.Router();

router.get("/sections", listSections);
router.get("/items", listItems);

module.exports = router;
