const puppeteer = require("puppeteer");
const path = require("path");
const ejs = require("ejs");

exports.generatePDF = async (req, res) => {
  const { resume, template } = req.body;

  try {
    // Load the correct EJS template for PDF
    const templatePath = path.join(
      __dirname,
      "../views/pdf_template.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
      resume,
      template: template || "modern"
    });

    // Launch chromium
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(html);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm" }
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=resume.pdf",
      "Content-Length": pdfBuffer.length
    });

    return res.send(pdfBuffer);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};
