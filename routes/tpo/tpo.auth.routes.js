// routes/tpo.auth.routes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * @route POST /tpo/signup
 * @desc  Register a new TPO account
 * @access Public (one-time setup or admin use)
 */
//rendering signup and login pages
router.get("/", (req, res) => {
  res.render("tpo/tposignup.ejs");
});
router.get("/loginpage", (req, res) => {
  res.render("tpo/tpologin.ejs");
});
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "TPO",       
      isApproved: true, 
    });

    res.status(201).json({
      message: "TPO registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// TPO Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "TPO" });
    if (!user) 
      //user not found or not a TPO not  signed up as TPO
      return res.redirect("/tpo/loginpage");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect("/tpo/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/dashboard", (req, res) => {
  res.render("tpo/tpodashboard.ejs");
});

module.exports = router;