const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 16,
    },
    hodId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // HOD user
  },
  { timestamps: true }
);

DepartmentSchema.index({ name: 1 });
DepartmentSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model("Department", DepartmentSchema);
