const mongoose = require("mongoose");

// Sub-schema for rounds inside each drive
const RoundSchema = new mongoose.Schema(
  {
    roundName: { type: String, required: true, trim: true },
    roundType: { type: String, trim: true }, // e.g., "Test", "Interview", "HR"
    date: { type: Date },
    totalParticipants: { type: Number, default: 0 },
    selectedStudents: [String], // just store student names
    rejectedStudents: [String],
    remarks: { type: String, trim: true },
  },
  { _id: false } // rounds are embedded, no need for ObjectIds
);

// Main Drive Schema
const DriveSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Offline",
    },
    venue: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    rounds: [RoundSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drive", DriveSchema);
