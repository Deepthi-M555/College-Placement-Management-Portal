// routes/tpo.auth.routes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Company = require("../../models/company.js");

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
// TPO Dashboard
router.get("/dashboard", (req, res) => {
  res.render("tpo/tpodashboard.ejs");
});
//company crud
//  1. View all companies
router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find({});
    res.render("tpo/companies", { companies });
  } catch (err) {
    console.error("Error fetching companies:", err.message);
    res.status(500).send("Server error: " + err.message);
  }
});


// 📍 2. Render Add Company Form
router.get("/companies/new", (req, res) => {
  res.render("tpo/companyForm.ejs", { company: null });
});

// 📍 3. Handle Add Company Form Submission
router.post("/companies", async (req, res) => {
  try {
    const { name, role, package: pkg, eligibilityCriteria, location, description, lastDateToApply } = req.body;

    await Company.create({
      name,
      role,
      package: pkg,
      eligibilityCriteria,
      location,
      description,
      lastDateToApply,
    });

    res.redirect("/tpo/companies");
  } catch (err) {
    console.error("Error adding company:", err);
    res.status(500).send("Server error");
  }
});

// 📍 4. Render Edit Company Form
router.get("/companies/edit/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    res.render("tpo/companyForm", { company });
  } catch (err) {
    console.error("Error loading company:", err);
    res.status(500).send("Server error");
  }
});

// 📍 5. Handle Update Company
router.post("/companies/update/:id", async (req, res) => {
  try {
    const { name, role, package: pkg, eligibilityCriteria, location, description, lastDateToApply } = req.body;
    await Company.findByIdAndUpdate(req.params.id, {
      name,
      role,
      package: pkg,
      eligibilityCriteria,
      location,
      description,
      lastDateToApply,
    });
    res.redirect("/tpo/companies");
  } catch (err) {
    console.error("Error updating company:", err);
    res.status(500).send("Server error");
  }
});

// 📍 6. Delete Company
router.post("/companies/delete/:id", async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.redirect("/tpo/companies");
  } catch (err) {
    console.error("Error deleting company:", err);
    res.status(500).send("Server error");
  }
});





module.exports = router;











