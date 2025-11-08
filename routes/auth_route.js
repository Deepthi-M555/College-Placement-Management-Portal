
const express = require('express');
const router = express.Router();

// Simple health endpoint for auth
router.get('/ping', (req, res) => res.json({ ok: true, msg: 'auth route responding' }));

// POST /api/auth/register  (placeholder)
router.post('/register', (req, res) => {
  // In real app: validate, hash password, store user
  return res.status(201).json({ msg: 'register endpoint (placeholder)', body: req.body });
});

// POST /api/auth/login (placeholder)
router.post('/login', (req, res) => {
  // In real app: check credentials and return JWT/session
  const { email } = req.body || {};
  return res.json({ msg: 'login endpoint (placeholder)', email: email || null });
});


const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const Tpo = require("../models/tpo/tporoutes");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");


// ✅ Signup Route (All logic here)
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Min 6 chars password"),
    body("role")
      .notEmpty()
      .isIn(["STUDENT", "HOD", "TPO"])
      .withMessage("Role must be STUDENT | HOD | TPO"),
    body("departmentId").optional().isMongoId(),
  ],

  asyncHandler(async (req, res, next) => {
    // ✅ Step 1: Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msg = errors.array().map(e => `${e.path}: ${e.msg}`).join("; ");
      throw new AppError(msg, 400);
    }

    const { name, email, password, role, departmentId } = req.body;

    // ✅ Step 2: Check if email exists
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError("Email already registered", 409);
    }

    // ✅ Step 3: Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Step 4: Approval logic
    let isApproved = false;

    if (role === "HOD" || role === "TPO") {
      isApproved = true; // HOD & TPO auto-approved
    }

    // ✅ Step 5: Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      departmentId: departmentId || null,
      isApproved,
    });

    // ✅ Step 6: Response
    res.status(201).json({
      status: "success",
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        departmentId: user.departmentId,
      },
    });
  })
);



router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  asyncHandler(async (req, res, next) => {
    // ✅ Step 1: Validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msg = errors.array().map(e => `${e.path}: ${e.msg}`).join("; ");
      throw new AppError(msg, 400);
    }

    const { email, password } = req.body;

    // ✅ Step 2: Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // ✅ Step 3: Compare password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // ✅ Step 4: Check approval (only students need approval)
    if (user.role === "STUDENT" && user.isApproved === false) {
      throw new AppError("Your account is awaiting HOD approval", 403);
    }

    // ✅ Step 5: Generate JWT
    const token = generateToken(user._id, user.role);

    // ✅ Step 6: Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,      // Set true when deploying with HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Step 7: Response
    res.status(200).json({
      status: "success",
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  })
);

module.exports = router;
