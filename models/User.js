const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "STUDENT",
      immutable: true,      // ✅ cannot be changed later
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    // ✅ Need HOD approval
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Useful index
StudentSchema.index({ email: 1 });

//module.exports = mongoose.model("Student", StudentSchema);
