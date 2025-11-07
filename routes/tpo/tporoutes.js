// routes/tpo.auth.routes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Tpo = require("../../models/tpo.js"); 
const Company = require("../../models/company.js");
//const upload = require("../../utils/upload");
//const { parseCsv } = require("../../utils/csv");
//const { sendMail } = require("../../utils/mailer");


const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/**
 * @route POST /tpo/signup
 * @desc  Register a new TPO account
 * @access Public (one-time setup or admin use)
 */
//rendering signup and login pages
// ✅ Show Signup Page
router.get("/", (req, res) => {
  res.render("tpo/tposignup.ejs", { errors: [] });
});

// ✅ Show Login Page
router.get("/signup", (req, res) => {
  res.render("tpo/tposignup.ejs", { errors: [] });
});

// ✅ TPO SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Check existing TPO
    const existing = await Tpo.findOne({ email });
    if (existing) {
      return res.render("tpo/tposignup.ejs", {
        errors: [{ msg: "Email already exists" }]
      });
    }

    // ✅ Hash Password
    const passwordHash = await bcrypt.hash(password, 10);

    // ✅ Create TPO entry
    await Tpo.create({
      name,
      email,
      passwordHash
    });

    // ✅ Redirect to login
    return res.redirect("/tpo/login");
  } catch (err) {
    console.error("Signup error:", err);
    return res.render("tpo/tposignup.ejs", {
      errors: [{ msg: "Server error during signup" }]
    });
  }
});
router.get("/login", (req, res) => {
  res.render("tpo/tpologin.ejs", { errors: [], old: {} });
});

// ✅ TPO LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Find TPO
    const tpo = await Tpo.findOne({ email });
    if (!tpo) {
      return res.render("tpo/tpologin.ejs", {
        errors: [{ msg: "TPO account not found" }]
      });
    }

    // ✅ Verify Password
    const valid = await bcrypt.compare(password, tpo.passwordHash);
    if (!valid) {
      return res.render("tpo/tpologin.ejs", {
        errors: [{ msg: "Incorrect password" }]
      });
    }

    // ✅ Redirect to dashboard
    return res.redirect("/tpo/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    return res.render("tpo/tpologin.ejs", {
      errors: [{ msg: "Server error during login" }]
    });
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


// 2. Render Add Company Form
router.get("/companies/new", (req, res) => {
  res.render("tpo/companyForm.ejs", { company: null });
});

// 3. Handle Add Company Form Submission
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

//  6. Delete Company
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
