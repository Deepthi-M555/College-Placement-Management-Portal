const express = require("express");
const bcrypt = require("bcryptjs");

const HOD = require("../../models/hod");  // ✅ correct model path

const router = express.Router();

/* ✅ 1. Default → redirect to login */
router.get("/", (req, res) => {
  res.redirect("/hod/login");
});

/* ✅ 2. Signup page */
router.get("/signup", (req, res) => {
  res.render("hod/hodsignup", { errors: [], old: {} });
});

/* ✅ 3. Handle signup */
router.post("/signup", async (req, res) => {
  const { name, email, password, department } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);
    await HOD.create({ name, email, password: hashed, department });

    return res.redirect("/hod/login");

  } catch (err) {
    return res.render("hod/hodsignup", {
      errors: [{ msg: "Email already exists" }],
      old: req.body
    });
  }
});

/* ✅ 4. Login page */
router.get("/login", (req, res) => {
  res.render("hod/hodlogin", { errors: [], old: {} });
});

/* ✅ 5. Handle login */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const hod = await HOD.findOne({ email });
  if (!hod) {
    return res.render("hod/hodlogin", {
      errors: [{ msg: "Invalid email or password" }],
      old: { email }
    });
  }

  const match = await bcrypt.compare(password, hod.password);
  if (!match) {
    return res.render("hod/hodlogin", {
      errors: [{ msg: "Invalid email or password" }],
      old: { email }
    });
  }

  return res.redirect("/hod/dashboard");
});

/* ✅ 6. Dashboard */
router.get("/dashboard", (req, res) => {
  res.send("HOD Dashboard");
});

module.exports = router;
