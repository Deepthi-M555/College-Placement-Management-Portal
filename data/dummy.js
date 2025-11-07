const mongoose = require("mongoose");
const User = require("./models/User");
const StudentProfile = require("./models/StudentProfile");
const Drive = require("./models/Drive");

async function createDummyData() {
  await mongoose.connect("mongodb://localhost:27017/placementPortal");

  // ✅ 1. Create Dummy Student User
  const user = await User.create({
    name: "Hackathon Student",
    email: "student@test.com",
    passwordHash: "test123",  // For now only
    role: "STUDENT",
    isApproved: true
  });

  // ✅ 2. Create Student Profile
  await StudentProfile.create({
    userId: user._id,
    usn: "1RV21CS001",
    studyYear: "BE",
    cgpa: 8.0,
    departmentId: null,
    skills: ["Node.js", "JavaScript"]
  });

  // ✅ 3. Create Sample Placement Drive
  await Drive.create({
    companyId: null,
    roleTitle: "Software Intern",
    ctcLpa: 6,
    eligibilityCgpa: 7.0,
    status: "OPEN",
    lastDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  console.log("✅ Dummy student + drive created!");
  process.exit();
}

createDummyData();
