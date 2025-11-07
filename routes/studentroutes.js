const express = require("express");
const bcrypt = require("bcryptjs")

const { body, validationResult } = require("express-validator");

const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const router = express.Router();

const Student = require("../models/Student");

// ✅ Step 1: Default → show signup page
router.get("/", (req, res) => {
  res.render("student/studentsignup", { errors: [], old: {} });
});

// ✅ Step 2: Show signup page separately if needed
router.get("/signup", (req, res) => {
  res.render("student/studentsignup", { errors: [], old: {} });
});

// ✅ Step 3: Handle signup form submit
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    await Student.create({
      name,
      email,
      passwordHash: hashed
    });

    // ✅ Redirect to dashboard after signup
    return res.redirect("/student/dashboard");

  } catch (err) {
    return res.render("student/studentsignup", {
      errors: [{ msg: "Email already exists" }],
      old: req.body
    });
  }
});


// ✅ Step 4: Show login page
router.get("/login", (req, res) => {
  res.render("student/studentlogin", { errors: [], old: {} });
});

// ✅ Step 5: Handle login submit
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // ✅ Find student
  const student = await Student.findOne({ email });
  if (!student) {
    return res.render("student/studentlogin", {
      errors: [{ msg: "Invalid email or password" }],
      old: { email }
    });
  }

  // ✅ Check password
  const match = await bcrypt.compare(password, student.passwordHash);
  if (!match) {
    return res.render("student/studentlogin", {
      errors: [{ msg: "Invalid email or password" }],
      old: { email }
    });
  }

  // ✅ Login success → Redirect to dashboard
  res.redirect("/student/dashboard");
});

// ✅ Step 6: Dashboard
router.get("/dashboard", (req, res) => {
  res.send("<h1>Welcome to Student Dashboard ✅</h1>");
});

module.exports = router;
