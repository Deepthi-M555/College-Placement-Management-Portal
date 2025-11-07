const mongoose = require("mongoose");

const ROLES = ["STUDENT", "HOD", "TPO"];
const STATUS = ["PENDING", "APPROVED", "REJECTED"];

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

    passwordHash: { type: String, required: true }, // hashed password

    role: { type: String, enum: ROLES, required: true, index: true },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: function () {
        // Required for STUDENT and HOD, optional for TPO
        return this.role === "STUDENT" || this.role === "HOD";
      },
    },

    // 👇 NEW FIELD: approval status for students (replaces isApproved)
    status: {
      type: String,
      enum: STATUS,
      default: "PENDING",
      index: true,
    },
  },
  { timestamps: true }
);

// Helpful compound index for queries by role + department
UserSchema.index({ role: 1, departmentId: 1 });

module.exports = mongoose.model("User", UserSchema);
