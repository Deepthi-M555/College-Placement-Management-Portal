const express = require("express");
const router = express.Router();

router.post("/ats", (req, res) => {
  const { text } = req.body;

  // simple fake ATS score (you can replace with AI later)
  const score = Math.floor(Math.random() * (95 - 65 + 1) + 65);

  res.json({ success: true, score });
});

module.exports = router;
