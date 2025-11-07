const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true }, // Job role like 'Software Engineer'
    package: { type: String, required: true }, // Example: '6 LPA'
    eligibilityCriteria: { type: String, required: true }, // Example: 'Above 7 CGPA'
    location: { type: String, default: "N/A" },
    description: { type: String },
    lastDateToApply: { type: Date },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // TPO reference
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
