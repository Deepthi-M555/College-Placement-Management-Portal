const express = require("express");
const router = express.Router();

const dummyStudent = {
  name: "John Doe",
  profileComplete: false,
  totalDrives: 4,
  appliedDrives: 1,
  profile: {}
};

// ✅ Dashboard Route
router.get("/dashboard", (req, res) => {
  res.render("student/dashboard", { user: dummyStudent });
});

// ✅ Profile Page (GET)
router.get("/profile", (req, res) => {
  res.render("student/profile", {
    user: dummyStudent,
    profile: dummyStudent.profile
  });
});

// ✅ Profile Page (POST - Save Data Temporarily)
router.post("/profile", (req, res) => {
  const { usn, studyYear, cgpa, phone, skills } = req.body;
  dummyStudent.profile = { usn, studyYear, cgpa, phone, skills };
  dummyStudent.profileComplete = true;
  res.redirect("/student/dashboard");
});

module.exports = router;
