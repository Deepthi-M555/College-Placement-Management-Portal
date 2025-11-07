const mongoose = require("mongoose");

const ROLES = ["STUDENT", "HOD", "TPO"];

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
      index: true,
    },
    passwordHash: { type: String, required: true }, // store hash, never plain text
    role: { type: String, enum: ROLES, required: true, index: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }, // optional for TPO
    isApproved: { type: Boolean, default: false }, // HOD approval for students
  },
  { timestamps: true }
);

// Helpful indexes
UserSchema.index({ role: 1, departmentId: 1 });

module.exports = mongoose.model("User", UserSchema);
