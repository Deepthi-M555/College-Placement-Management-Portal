const express = require("express");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandling");

const app = express();
const studentRoutes = require("./routes/studentRoutes");

const cookieParser = require("cookie-parser");

// ✅ Body parsers
app.use(express.json()); // For APIs (JSON)
app.use(express.urlencoded({ extended: true })); // For forms
app.use(cookieParser());

// ✅ EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Static files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Page Routes
app.get("/", (req, res) => res.render("home"));
app.get("/student/login", (req, res) => res.render("student-login"));
app.get("/hod/login", (req, res) => res.render("hod-login"));
app.get("/tpo/login", (req, res) => res.render("tpo/tpologin"));
app.get("/resume-ai", (req, res) => res.render("resume-ai"));

// ✅ Student Routes
app.use("/student", studentRoutes);

// ✅ API Routes
app.use("/api/auth", require("./routes/auth_route"));
app.use("/api/tpo", require("./routes/tpo/tpo.auth.routes"));  // TPO API routes

// ✅ Error handlers
app.use(notFound);
app.use(errorHandler);

// ✅ Database + Server Start
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(
        `✅ Server running on http://localhost:${process.env.PORT || 8080}`
      );
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err.message);
    process.exit(1);
  });
