const mongoose = require("mongoose");

const APP_STATUS = [
  "APPLIED",
  "ROUND_1",
  "ROUND_2",
  "ROUND_3",
  "SELECTED",
  "REJECTED",
  "OFFERED",
  "JOINED",
];

const ApplicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      required: true,
      index: true,
    },
    currentStatus: {
      type: String,
      enum: APP_STATUS,
      default: "APPLIED",
      index: true,
    },
    currentRound: { type: Number, min: 0, default: 0 },
    aiScore: { type: Number, min: 0, max: 1 }, // 0.000–1.000 (TF-IDF/keyword blend)
    notes: String,
  },
  { timestamps: true }
);

// One application per student per drive
ApplicationSchema.index(
  { studentId: 1, driveId: 1 },
  { unique: true, name: "uq_student_drive" }
);

// For ranking/shortlisting pages
ApplicationSchema.index({ aiScore: -1 });

module.exports = mongoose.model("Application", ApplicationSchema);
