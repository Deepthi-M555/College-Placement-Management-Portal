const mongoose = require("mongoose");

const DRIVE_STATUS = ["DRAFT", "OPEN", "CLOSED"];

const DriveSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    roleTitle: { type: String, required: true, trim: true },
    ctcLpa: { type: Number, min: 0 },        // optional
    stipendMonthly: { type: Number, min: 0 },// optional
    location: String,
    eligibilityCgpa: { type: Number, min: 0, max: 10 },
    batchYear: { type: Number, min: 2000, max: 2100 },
    jdText: { type: String },
    lastDate: { type: Date, required: true, index: true },
    status: { type: String, enum: DRIVE_STATUS, default: "DRAFT", index: true },
    createdByTpoId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true }
);

// Text search for discovery
DriveSchema.index({ jdText: "text", roleTitle: "text" });

module.exports = mongoose.model("Drive", DriveSchema);
