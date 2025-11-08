// routes/tpo.auth.routes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User.js");
const Company = require("../../models/company.js");
const upload = require("../../utils/tpo/upload.js");
const { parseCsv } = require("../../utils/tpo/csv.js");
const { sendMail } = require("../../utils/tpo/mailer.js");
const Drive = require("../../models/drive.js");
const Application = require("../../models/Application.js");
const Analytics = require("../../models/analytics");



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
router.get("/companies/:id/applications", async (req, res) => {
  try {
    const companyId = req.params.id;

    // Find all drives for this company
    const drives = await Drive.find({ company: companyId });
    if (!drives.length) {
      return res.render("tpo/companyApplication.ejs", { company: null, applications: [] });
    }

    // Collect all drive IDs
    const driveIds = drives.map(d => d._id);

    // Find all applications linked to these drives
    const applications = await Application.find({ driveId: { $in: driveIds } })
      .populate("studentId", "name email")
      .populate("driveId", "title");

    const company = drives[0].company || "Unknown Company";

    res.render("tpo/companyApplications.ejs", { company, applications });
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).send("Server error while fetching applications.");
  }
});


//placement drive feature to be added here
// List active + recently completed (last 60 days)
router.get("/drives", async (req, res) => {
  try {
    // Fetch all drives from the database
    const drives = await Drive.find({});

    // Render your EJS file and pass the drives
    res.render("tpo/drives/index.ejs", { drives });
  } catch (err) {
    console.error("❌ Error fetching drives:", err);
    res.status(500).send("Server error while fetching drives.");
  }
});

// ✅ CREATE — Show new drive form
router.get("/drives/new", (req, res) => {
  res.render("tpo/drives/new.ejs");
});

// ✅ CREATE — Handle form submission
router.post("/drives", async (req, res) => {
  try {
    const { company, title, description, mode, venue, isActive } = req.body;
    await Drive.create({
      company,
      title,
      description,
      mode,
      venue,
      isActive: isActive === "on",
    });
    res.redirect("/tpo/drives");
  } catch (err) {
    console.error("❌ Error creating drive:", err);
    res.status(500).send("Failed to create drive.");
  }
});

// ✅ EDIT — Show edit form
router.get("/drives/:id/edit", async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).send("Drive not found");
    res.render("tpo/drives/edit.ejs", { drive });
  } catch (err) {
    console.error("❌ Error loading edit form:", err);
    res.status(500).send("Server error while editing drive.");
  }
});

// ✅ UPDATE — Handle edit form submission
router.post("/drives/:id", async (req, res) => {
  try {
    const { company, title, description, mode, venue, isActive } = req.body;
    await Drive.findByIdAndUpdate(req.params.id, {
      company,
      title,
      description,
      mode,
      venue,
      isActive: isActive === "on",
    });
    res.redirect("/tpo/drives");
  } catch (err) {
    console.error("❌ Error updating drive:", err);
    res.status(500).send("Failed to update drive.");
  }
});

// ✅ DELETE — Remove a drive
router.post("/drives/:id/delete", async (req, res) => {
  try {
    await Drive.findByIdAndDelete(req.params.id);
    res.redirect("/tpo/drives");
  } catch (err) {
    console.error("❌ Error deleting drive:", err);
    res.status(500).send("Failed to delete drive.");
  }
});

router.get("/drives/:id", async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);

    if (!drive) {
      return res.status(404).send("Drive not found");
    }

    res.render("tpo/drives/show.ejs", { drive });
  } catch (err) {
    console.error("❌ Error fetching drive details:", err);
    res.status(500).send("Server error while fetching drive details.");
  }
});



// ✅ Show form to enter statistics for a specific drive
router.get("/drives/:id/analytics/new", async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).send("Drive not found");
    res.render("tpo/analytics/new.ejs", { drive });
  } catch (err) {
    console.error("❌ Error loading analytics form:", err);
    res.status(500).send("Server error loading analytics form");
  }
});

// ✅ Handle form submission and save analytics data
router.post("/drives/:id/analytics", async (req, res) => {
  try {
    const { departments } = req.body;
    const drive = await Drive.findById(req.params.id);
    if (!drive) return res.status(404).send("Drive not found");

    // Handle possible JSON/stringified data from form
    const departmentArray = typeof departments === "string" ? JSON.parse(departments) : departments;

    const totalOffers = departmentArray.reduce(
      (sum, d) => sum + Number(d.studentsPlaced || 0),
      0
    );

    const analytics = new Analytics({
      driveId: drive._id,
      company: drive.company,
      driveTitle: drive.title,
      departmentStats: departmentArray,
      totalOffers,
    });

    await analytics.save();
    console.log("✅ Analytics saved successfully!");
    res.redirect("/tpo/reports");
  } catch (err) {
    console.error("❌ Error saving analytics:", err);
    res.status(500).send("Server error while saving analytics");
  }
});

// ✅ Show analytics dashboard
router.get("/reports", async (req, res) => {
  try {
    const analytics = await Analytics.find({});
    res.render("tpo/analytics/index.ejs", { analytics });
  } catch (err) {
    console.error("❌ Error loading analytics dashboard:", err);
    res.status(500).send("Server error loading analytics dashboard");
  }
});



router.get("/round-results", async (req, res) => {
  try {
    const drives = await Drive.find({}).sort({ updatedAt: -1 });
    res.render("tpo/round-results/index.ejs", { drives });
  } catch (err) {
    console.error("Error loading round results dashboard:", err);
    res.status(500).send("Server error");
  }
});

// NEW FORM: add round result for a drive
router.get("/round-results/new/:driveId", async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).send("Drive not found");
    res.render("tpo/round-results/new.ejs", { drive });
  } catch (err) {
    console.error("Error loading round form:", err);
    res.status(500).send("Server error");
  }
});

// CREATE: save round result for a drive
router.post("/round-results/:driveId", async (req, res) => {
  try {
    const {
      roundName, roundType, date, totalParticipants,
      selectedStudents, rejectedStudents, remarks
    } = req.body;

    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).send("Drive not found");

    drive.rounds.push({
      roundName,
      roundType,
      date,
      totalParticipants: Number(totalParticipants) || 0,
      selectedStudents: (selectedStudents || "")
        .split(",").map(s => s.trim()).filter(Boolean),
      rejectedStudents: (rejectedStudents || "")
        .split(",").map(s => s.trim()).filter(Boolean),
      remarks
    });

    await drive.save();
    res.redirect(`/tpo/round-results/show/${req.params.driveId}`);
  } catch (err) {
    console.error("Error saving round result:", err);
    res.status(500).send("Failed to save round result");
  }
});

// SHOW: all rounds for a given drive (table + chart)
router.get("/round-results/show/:driveId", async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).send("Drive not found");
    res.render("tpo/round-results/show.ejs", { drive });
  } catch (err) {
    console.error("Error fetching round results:", err);
    res.status(500).send("Server error");
  }
});

// ✅ Render "Add New Round" form
router.get("/round-results/new/:driveId", async (req, res) => {
  const drive = await Drive.findById(req.params.driveId);
  if (!drive) return res.status(404).send("Drive not found");
  res.render("tpo/round-results/new.ejs", { drive });
});

// ✅ Handle round creation
router.post("/round-results/new/:driveId", async (req, res) => {
  try {
    const { roundName, roundType, date, totalParticipants, selectedStudents, rejectedStudents, remarks } = req.body;

    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).send("Drive not found");

    drive.rounds.push({
      roundName,
      roundType,
      date,
      totalParticipants,
      selectedStudents: selectedStudents ? selectedStudents.split(",").map(s => s.trim()) : [],
      rejectedStudents: rejectedStudents ? rejectedStudents.split(",").map(s => s.trim()) : [],
      remarks
    });

    await drive.save();
    res.redirect(`/tpo/round-results/show/${drive._id}`);
  } catch (err) {
    console.error("❌ Error adding round:", err);
    res.status(500).send("Server error while adding round.");
  }
});
module.exports = router;











