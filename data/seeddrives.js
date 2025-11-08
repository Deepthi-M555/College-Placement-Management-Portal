const mongoose = require("mongoose");
const Drive = require("../models/drive");

const dummyDrives = [
  {
    company: "Infosys",
    title: "System Engineer Hiring Drive",
    description:
      "Infosys is hiring graduates for the role of System Engineer. Candidates will undergo online test and interviews.",
    mode: "Online",
    venue: "Virtual Platform",
    isActive: true,
    rounds: [
      {
        roundName: "Online Test",
        roundType: "Aptitude",
        date: new Date("2025-11-10"),
        totalParticipants: 60,
        selectedStudents: ["Rahul N", "Sneha S", "Arjun V"],
        rejectedStudents: ["Deepthi L", "Manoj K"],
        remarks: "Top 3 scorers shortlisted.",
      },
      {
        roundName: "Technical Interview",
        roundType: "Interview",
        date: new Date("2025-11-12"),
        totalParticipants: 3,
        selectedStudents: ["Rahul N", "Sneha S"],
        rejectedStudents: ["Arjun V"],
        remarks: "Strong technical grasp.",
      },
    ],
  },
  {
    company: "TCS",
    title: "Ninja Campus Recruitment 2025",
    description:
      "TCS is conducting its annual campus drive for Ninja and Digital profiles. Selection through online test and interview rounds.",
    mode: "Hybrid",
    venue: "College Seminar Hall / Online",
    isActive: true,
    rounds: [
      {
        roundName: "Online Test",
        roundType: "Aptitude + Coding",
        date: new Date("2025-11-15"),
        totalParticipants: 120,
        selectedStudents: ["Meghana R", "Kiran M", "Diya S", "Aakash K"],
        rejectedStudents: ["Pooja T", "Vivek B"],
        remarks: "Shortlisted based on coding test performance.",
      },
    ],
  },
  {
    company: "Accenture",
    title: "Associate Software Engineer Drive",
    description:
      "Accenture is hiring 2025 graduates for the ASE profile. The process includes technical and HR rounds.",
    mode: "Offline",
    venue: "Main Auditorium",
    isActive: false,
    rounds: [
      {
        roundName: "Technical Interview",
        roundType: "Interview",
        date: new Date("2025-10-25"),
        totalParticipants: 8,
        selectedStudents: ["Rohit G", "Sneha S"],
        rejectedStudents: ["Karthik V", "Deepa J"],
        remarks: "Final selections made after technical interview.",
      },
      {
        roundName: "HR Interview",
        roundType: "Interview",
        date: new Date("2025-10-27"),
        totalParticipants: 2,
        selectedStudents: ["Sneha S"],
        rejectedStudents: ["Rohit G"],
        remarks: "Offer extended to Sneha.",
      },
    ],
  },
];

async function seedDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/cpmp");
    console.log("✅ Connected to MongoDB");

    await Drive.deleteMany({});
    await Drive.insertMany(dummyDrives);
    console.log("🌱 Dummy drives inserted successfully!");

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding drives:", err);
  }
}

seedDB();
