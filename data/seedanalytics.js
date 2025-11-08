const mongoose = require("mongoose");
const Analytics =  require("../models/analytics");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cpmp";

const dummyAnalytics = [
  {
    driveId: "672a10c4c9f8f91b8a8e31c9", // Example drive ID
    company: "Infosys",
    driveTitle: "System Engineer Hiring Drive",
    totalOffers: 25,
    departmentStats: [
      { department: "CSE", studentsPlaced: 10 },
      { department: "ECE", studentsPlaced: 6 },
      { department: "EEE", studentsPlaced: 3 },
      { department: "ME", studentsPlaced: 2 },
      { department: "CIVIL", studentsPlaced: 4 },
    ],
  },
  {
    driveId: "672a10c4c9f8f91b8a8e31d0",
    company: "TCS",
    driveTitle: "Digital Associate Recruitment Drive",
    totalOffers: 32,
    departmentStats: [
      { department: "CSE", studentsPlaced: 14 },
      { department: "ISE", studentsPlaced: 8 },
      { department: "ECE", studentsPlaced: 5 },
      { department: "EEE", studentsPlaced: 3 },
      { department: "ME", studentsPlaced: 2 },
    ],
  },
  {
    driveId: "672a10c4c9f8f91b8a8e31e5",
    company: "Wipro",
    driveTitle: "Project Engineer Placement Drive",
    totalOffers: 20,
    departmentStats: [
      { department: "CSE", studentsPlaced: 9 },
      { department: "ECE", studentsPlaced: 5 },
      { department: "ISE", studentsPlaced: 3 },
      { department: "ME", studentsPlaced: 2 },
      { department: "CIVIL", studentsPlaced: 1 },
    ],
  },
  {
    driveId: "672a10c4c9f8f91b8a8e31e6",
    company: "Cognizant",
    driveTitle: "Graduate Trainee Hiring",
    totalOffers: 27,
    departmentStats: [
      { department: "CSE", studentsPlaced: 12 },
      { department: "ECE", studentsPlaced: 7 },
      { department: "EEE", studentsPlaced: 3 },
      { department: "ISE", studentsPlaced: 3 },
      { department: "ME", studentsPlaced: 2 },
    ],
  },
  {
    driveId: "672a10c4c9f8f91b8a8e31e7",
    company: "Accenture",
    driveTitle: "Associate Software Engineer Drive",
    totalOffers: 30,
    departmentStats: [
      { department: "CSE", studentsPlaced: 13 },
      { department: "ECE", studentsPlaced: 6 },
      { department: "ISE", studentsPlaced: 5 },
      { department: "EEE", studentsPlaced: 4 },
      { department: "ME", studentsPlaced: 2 },
    ],
  },
  {
    driveId: "672a10c4c9f8f91b8a8e31e8",
    company: "Tech Mahindra",
    driveTitle: "Associate Engineer Placement Drive",
    totalOffers: 18,
    departmentStats: [
      { department: "CSE", studentsPlaced: 7 },
      { department: "ECE", studentsPlaced: 4 },
      { department: "ISE", studentsPlaced: 3 },
      { department: "ME", studentsPlaced: 2 },
      { department: "CIVIL", studentsPlaced: 2 },
    ],
  },
  {
    driveId: "672a10c4c9f8f91b8a8e31e9",
    company: "IBM",
    driveTitle: "Software Developer Hiring",
    totalOffers: 22,
    departmentStats: [
      { department: "CSE", studentsPlaced: 11 },
      { department: "ECE", studentsPlaced: 4 },
      { department: "ISE", studentsPlaced: 3 },
      { department: "EEE", studentsPlaced: 2 },
      { department: "ME", studentsPlaced: 2 },
    ],
  },
];

async function seedAnalytics() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await Analytics.deleteMany({});
    await Analytics.insertMany(dummyAnalytics);

    console.log("🎯 Dummy analytics data inserted successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error inserting analytics data:", err);
  }
}

seedAnalytics();
