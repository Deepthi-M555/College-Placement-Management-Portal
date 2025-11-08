const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  department: String,
  totalStudents: Number,
  studentsPlaced: Number,
  averagePackage: Number,
  highestPackage: Number,
});

const AnalyticsSchema = new mongoose.Schema(
  {
    driveId: { type: mongoose.Schema.Types.ObjectId, ref: "Drive", required: true },
    company: String,
    driveTitle: String,
    departmentStats: [DepartmentSchema],
    totalOffers: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analytics", AnalyticsSchema);
