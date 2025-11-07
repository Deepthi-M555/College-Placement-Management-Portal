const express = require("express");
const path = require("path");

const app = express();

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.get("/", (req, res) => res.render("home"));
app.get("/student/login", (req, res) => res.render("student-login.ejs"));
app.get("/hod/login", (req, res) => res.render("hod-login.ejs"));
app.get("/tpo/login", (req, res) => res.render("tpo-login.ejs"));
app.get("/resume-ai", (req, res) => res.render("resume-ai.ejs"));

// Start server
app.listen(8080, () => {
  console.log("✅ Server is running on http://localhost:8080");
});
