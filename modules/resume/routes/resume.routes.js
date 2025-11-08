const express = require("express");
const router = express.Router();
const resumeCtrl = require("../controllers/resume.controller");

// ✅ Landing page
router.get("/", resumeCtrl.getLanding);

// ✅ Builder page
router.get("/builder", resumeCtrl.getBuilder);

// ✅ Temporary preview
router.get("/preview/temp", (req, res) => {
  res.render("preview", {
    resume: {
      basics: { name: "Your Name", email: "email@example.com", summary: "Your summary here" },
      skills: ["skill1", "skill2"],
      experience: [],
      projects: []
    },
    template: "modern"
  });
});

module.exports = router;
