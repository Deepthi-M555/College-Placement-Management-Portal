// saveRoute.js
const express = require("express");
const router = express.Router();

// ✅ Save Resume Route
router.post("/save", (req, res) => {
  try {
    const { resume } = req.body;

    console.log("✅ Received resume to save:");
    console.log(resume);

    // If you later want DB:
    // await ResumeModel.findOneAndUpdate({ userId }, { resume }, { upsert: true });

    return res.json({ success: true, message: "Resume saved successfully!" });

  } catch (error) {
    console.error("❌ Error saving resume:", error);
    return res.json({ success: false, message: "Failed to save resume" });
  }
});

module.exports = router;
