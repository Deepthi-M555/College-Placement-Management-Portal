const express = require("express");
const router = express.Router();
const pdfCtrl = require("../controllers/pdf.controller");

router.post("/generate", pdfCtrl.generatePDF);

module.exports = router;
