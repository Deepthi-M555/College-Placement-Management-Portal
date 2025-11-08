const express = require("express");
const router = express.Router();
const aiCtrl = require("../controllers/ai.controller");

// POST /resume/ai/analyze
router.post("/analyze", aiCtrl.analyze);

module.exports = router;
