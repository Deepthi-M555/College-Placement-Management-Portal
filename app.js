const express = require("express");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandling");
<<<<<<< HEAD

=======
const tpoRoutes = require("./routes/tpo/tporoutes.js");
const hodRoutes = require("./routes/hod/hodroutes");
>>>>>>> f7c9b9f1d236714c1a82e12b46ae4c647fa5c0f8
const app = express();

// ✅ JSON body parser (for APIs)
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// ✅ Form body parser (for EJS forms)
app.use(express.urlencoded({ extended: true }));

// ✅ EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ Static files
app.use(express.static(path.join(__dirname, "public")));

// ✅ EJS page routes
app.get("/", (req, res) => res.render("home"));
<<<<<<< HEAD
app.get("/student/login", (req, res) => res.render("student-login"));
app.use("/hod", require("./routes/hod/hod.routes.js"));
app.use("/tpo", require("./routes/tpo/tpo.auth.routes"));
=======
app.use("/student", require("./routes/studentroutes"));

app.use("/hod", hodRoutes);
app.use("/tpo", tpoRoutes);


>>>>>>> f7c9b9f1d236714c1a82e12b46ae4c647fa5c0f8
app.get("/resume-ai", (req, res) => res.render("resume-ai"));

// ✅ API ROUTES
//app.use("/api/auth", require("./routes/auth_route"));
<<<<<<< HEAD
app.use("/api/tpo", require("./routes/tpo/tpo.auth.routes"));  // ✅ teammate’s TPO routes
=======
//app.use("/api/tpo", require("./routes/tpo/tpo.auth.routes"));  // ✅ teammate’s TPO routes
>>>>>>> f7c9b9f1d236714c1a82e12b46ae4c647fa5c0f8

// ✅ Error handlers
app.use(notFound);
app.use(errorHandler);

// ✅ DB + Server start
<<<<<<< HEAD
// ✅ DB + Server start
=======
>>>>>>> f7c9b9f1d236714c1a82e12b46ae4c647fa5c0f8
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
