const mongoose = require("mongoose");

const ROLES = ["STUDENT", "HOD", "TPO"];

const UserSchema = new mongoose.Schema(
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
      // ✅ NOTE: we will hash password in the signup route
    },

    role: {
      type: String,
      enum: ROLES,
      required: true,
      index: true,
    },

    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    // ✅ For students: false until HOD approves
    // ✅ For HOD + TPO: true from beginning
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Index to speed up queries like: find all students of a department
UserSchema.index({ role: 1, departmentId: 1 });

module.exports = mongoose.model("User", UserSchema);
