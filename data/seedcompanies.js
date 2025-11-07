const mongoose = require("mongoose");
const Company = require("../models/company.js");

const dummyCompanies = [
  {
    name: "Infosys",
    role: "System Engineer",
    package: "3.6 LPA",
    eligibilityCriteria: "Minimum 6.5 CGPA, No active backlogs",
    location: "Bangalore, India",
    description: "Infosys is hiring fresh graduates for the role of System Engineer. Candidates should have strong problem-solving skills and basic programming knowledge in Java or Python.",
    lastDateToApply: new Date("2025-12-15")
  },
  {
    name: "TCS",
    role: "Graduate Trainee",
    package: "3.5 LPA",
    eligibilityCriteria: "Above 60% in 10th, 12th and UG",
    location: "Chennai, India",
    description: "TCS National Qualifier Test (NQT) drive for final-year engineering students.",
    lastDateToApply: new Date("2025-11-25")
  },
  {
    name: "Accenture",
    role: "Associate Software Engineer",
    package: "4.5 LPA",
    eligibilityCriteria: "7 CGPA and above, no backlogs",
    location: "Hyderabad, India",
    description: "Accenture is hiring for Associate Software Engineer positions.",
    lastDateToApply: new Date("2025-12-10")
  },
  {
    name: "Wipro",
    role: "Project Engineer",
    package: "3.5 LPA",
    eligibilityCriteria: "Minimum 60% overall, no active backlog",
    location: "Pune, India",
    description: "Wipro Elite National Talent Hunt for B.E./B.Tech graduates across all branches.",
    lastDateToApply: new Date("2025-11-20")
  },
  {
    name: "Amazon",
    role: "SDE Intern",
    package: "60,000/month",
    eligibilityCriteria: "8+ CGPA, Strong in DSA and OOPs",
    location: "Bangalore, India",
    description: "Amazon is offering internship opportunities for pre-final year students.",
    lastDateToApply: new Date("2025-12-05")
  },
  {
    name: "Cognizant",
    role: "Programmer Analyst Trainee",
    package: "4 LPA",
    eligibilityCriteria: "Above 7 CGPA, 2025 Batch",
    location: "Kolkata, India",
    description: "Cognizant is hiring Programmer Analyst Trainees.",
    lastDateToApply: new Date("2025-11-30")
  },
  {
    name: "Tech Mahindra",
    role: "Associate Engineer",
    package: "3.25 LPA",
    eligibilityCriteria: "Minimum 6 CGPA, 2025 passout batch",
    location: "Pune, India",
    description: "Tech Mahindra is hiring graduates for software and support roles.",
    lastDateToApply: new Date("2025-11-28")
  }
];

async function seedDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/placementPortal");
    console.log("Connected to MongoDB");
    await Company.deleteMany({});
    await Company.insertMany(dummyCompanies);
    console.log(" Dummy company data inserted successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error(" Error inserting data:", err);
  }
}

seedDB();
