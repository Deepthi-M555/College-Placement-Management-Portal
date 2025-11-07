import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Needed for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.get("/", (req, res) => res.render("home"));
app.get("/student/login", (req, res) => res.render("student-login"));
app.get("/hod/login", (req, res) => res.render("hod-login"));
app.get("/tpo/login", (req, res) => res.render("tpo-login"));
app.get("/resume-ai", (req, res) => res.render("resume-ai"));

// Start server
app.listen(8080, () => {
  console.log("✅ Server running on http://localhost:8080");
});
