const express = require("express");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandling");


const tpoRoutes = require("./routes/tpo/tporoutes.js");
const hodRoutes = require("./routes/hod/hodroutes");
const studentRoutes = require("./routes/studentroutes");
const pdfRoutes = require("./modules/resume/routes/pdf.routes.js");



const tpoRoutes = require("./routes/tpo/tporoutes.js");
const hodRoutes = require("./routes/hod/hodroutes");

const app = express();

// ✅ Resume Module routes
const resumeRoutes = require("./modules/resume/routes/resume.routes");
const aiRoutes = require("./modules/resume/routes/ai.routes.js");
const scoringRoutes = require("./modules/resume/routes/scoring.routes");

const atsRoute = require("./modules/resume/routes/atsRoute");



const saveRoute = require("./modules/resume/routes/saveRoute.js");
// -------------------------------
// Middleware
// -------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// -------------------------------
// EJS Setup
// -------------------------------
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "modules/resume/views")
]);

// -------------------------------
// Static Files
// -------------------------------
app.use("/resume/public", express.static(path.join(__dirname, "modules/resume/public")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/resume/scoring", scoringRoutes);
app.use("/resume/pdf", pdfRoutes);
app.use("/resume", resumeRoutes);
app.use("/resume/ai", aiRoutes);
app.use("/resume", saveRoute);
app.use("/resume", atsRoute);
// -------------------------------
// Routes
// -------------------------------
app.get("/", (req, res) => res.render("home"));

app.get("/student/login", (req, res) => res.render("student-login"));
app.use("/hod", require("./routes/hod/hod.routes.js"));
app.use("/tpo", require("./routes/tpo/tpo.auth.routes"));

app.use("/student", require("./routes/studentroutes"));

app.use("/student", studentRoutes);
app.use("/hod", hodRoutes);
app.use("/tpo", tpoRoutes);


app.get("/resume-ai", (req, res) => res.render("resume-ai"));

// ✅ API ROUTES
//app.use("/api/auth", require("./routes/auth_route"));

app.use("/api/tpo", require("./routes/tpo/tpo.auth.routes"));  // ✅ teammate’s TPO routes

//app.use("/api/tpo", require("./routes/tpo/tpo.auth.routes"));  // ✅ teammate’s TPO routes

// ✅ Error handlers
app.use(notFound);
app.use(errorHandler);
// ✅ DB + Server start
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
