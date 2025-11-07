const mongoose = require("mongoose");

<<<<<<< HEAD
const ROLES = ["STUDENT", "HOD", "TPO"];
const STATUS = ["PENDING", "APPROVED", "REJECTED"];

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
=======
const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
>>>>>>> f7c9b9f1d236714c1a82e12b46ae4c647fa5c0f8

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
      index: true,
    },

<<<<<<< HEAD
    passwordHash: { type: String, required: true }, // hashed password

    role: { type: String, enum: ROLES, required: true, index: true },
=======
    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "STUDENT",
      immutable: true,      // ✅ cannot be changed later
    },
>>>>>>> f7c9b9f1d236714c1a82e12b46ae4c647fa5c0f8

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
<<<<<<< HEAD
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
=======
      default: null,
    },

    // ✅ Need HOD approval
    isApproved: {
      type: Boolean,
      default: false,
>>>>>>> f7c9b9f1d236714c1a82e12b46ae4c647fa5c0f8
    },
  },
  { timestamps: true }
);

<<<<<<< HEAD
// Helpful compound index for queries by role + department
UserSchema.index({ role: 1, departmentId: 1 });
=======
// ✅ Useful index
StudentSchema.index({ email: 1 });
>>>>>>> f7c9b9f1d236714c1a82e12b46ae4c647fa5c0f8

//module.exports = mongoose.model("Student", StudentSchema);
