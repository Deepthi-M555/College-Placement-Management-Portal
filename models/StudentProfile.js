const mongoose = require("mongoose");

const STUDY_YEAR = ["FY", "SY", "TY", "BE", "PG"];

const StudentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one profile per user
      index: true,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
      index: true,
    },
    usn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 32,
      index: true,
    },
    studyYear: { type: String, enum: STUDY_YEAR, required: true },
    cgpa: { type: Number, min: 0, max: 10 },
    phone: { type: String, trim: true },
    altEmail: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },
    resumeUrl: { type: String, trim: true }, // S3/GCS/local URL; GridFS optional later
    skills: { type: [String], default: [], index: true }, // keep inline index
    experienceYears: { type: Number, min: 0, default: 0 },
    achievements: String,
  },
  { timestamps: true }
);

// Useful compound index for department + top cgpa results
StudentProfileSchema.index({ departmentId: 1, cgpa: -1 });

// (removed duplicate StudentProfileSchema.index({ skills: 1 }) )

module.exports = mongoose.model("StudentProfile", StudentProfileSchema);
