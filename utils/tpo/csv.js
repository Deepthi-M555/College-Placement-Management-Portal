// utils/csv.js
/**
 * CSV Utility Functions
 * ---------------------
 * Supports reading and writing CSV files for placement drives:
 * - Parsing uploaded CSVs (for marking results)
 * - Exporting data (selected/rejected student lists)
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { stringify } = require("csv-stringify/sync");

/**
 * Parse CSV File → Convert uploaded CSV to JSON objects
 * Expected columns: `studentId` or `email`, and `status`
 */
function parseResultsCSV(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Normalize fields
    const normalized = records.map((r) => ({
      studentId: r.studentId?.trim() || null,
      email: r.email?.trim() || null,
      status: (r.status || "").toLowerCase(),
    }));

    return normalized;
  } catch (err) {
    console.error("❌ Error parsing CSV:", err);
    throw new Error("Failed to parse CSV file");
  }
}

/**
 * Export students to CSV file
 * @param {Array} data - Array of objects with name, email, status fields
 * @param {String} outputPath - Absolute file path to save CSV
 */
function exportResultsCSV(data, outputPath) {
  try {
    const columns = ["name", "email", "status"];
    const csvContent = stringify(data, { header: true, columns });

    fs.writeFileSync(outputPath, csvContent);
    return outputPath;
  } catch (err) {
    console.error("❌ Error exporting CSV:", err);
    throw new Error("Failed to generate CSV file");
  }
}

/**
 * Temporary file path generator
 */
function getTempPath(fileName) {
  const folder = path.join(__dirname, "../uploads/tmp");
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  return path.join(folder, fileName);
}

module.exports = {
  parseResultsCSV,
  exportResultsCSV,
  getTempPath,
};
