const mongoose = require("mongoose");
const Application = require("../models/Application.js");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cpmp";

const dummyApplications = [
  {
    driveId: "672a10c4c9f8f91b8a8e31c9",
    studentId: "671b7e93e3b62b9c7f0ac6f1",
    resumeUrl: "https://resumes.s3.amazonaws.com/rahul.pdf",
    notes: "Eager to join.",
    stage: "APPLIED",
    finalStatus: "IN_PROGRESS",
  },
  {
    driveId: "672a10c4c9f8f91b8a8e31c9",
    studentId: "671b7e93e3b62b9c7f0ac6f2",
    resumeUrl: "https://resumes.s3.amazonaws.com/sneha.pdf",
    notes: "Interested in backend.",
    stage: "SHORTLISTED",
    finalStatus: "IN_PROGRESS",
  },
  {
    driveId: "672a10c4c9f8f91b8a8e31c9",
    studentId: "671b7e93e3b62b9c7f0ac6f3",
    resumeUrl: "https://resumes.s3.amazonaws.com/diya.pdf",
    notes: "Open to relocation.",
    stage: "INTERVIEW",
    finalStatus: "IN_PROGRESS",
  },
  {
    driveId: "672a10c4c9f8f91b8a8e31c9",
    studentId: "671b7e93e3b62b9c7f0ac6f4",
    resumeUrl: "https://resumes.s3.amazonaws.com/arjun.pdf",
    notes: "Focus on full stack.",
    stage: "OFFERED",
    finalStatus: "SELECTED",
  },
  {
    driveId: "672a10c4c9f8f91b8a8e31c9",
    studentId: "671b7e93e3b62b9c7f0ac6f5",
    resumeUrl: "https://resumes.s3.amazonaws.com/meghana.pdf",
    notes: "Interested in data engineering.",
    stage: "REJECTED",
    finalStatus: "REJECTED",
  },
];

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Application.deleteMany({});
    await Application.insertMany(dummyApplications);

    console.log("🌱 Dummy applications inserted successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  }
}

seedDB();
