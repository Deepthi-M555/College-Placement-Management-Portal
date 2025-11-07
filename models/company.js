const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    website: { type: String, trim: true },
    about: String,
    location: String,
  },
  { timestamps: true }
);

CompanySchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Company", CompanySchema);
