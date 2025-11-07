// scripts/seed-hod.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // HOD user
    let hod = await User.findOne({ email: 'hod@college.edu' });
    if (!hod) {
      hod = await User.create({
        name: 'HOD CSE',
        email: 'hod@college.edu',
        passwordHash: '$2b$10$abcdefghijklmnopqrstuv', // set a real hash if you validate
        role: 'HOD',
        status: 'APPROVED',
        department: 'CSE'
      });
    }

    // 3 pending students in CSE
    const students = [
      { name:'Anita', email:'anita@college.edu' },
      { name:'Rahul', email:'rahul@college.edu' },
      { name:'Zoya',  email:'zoya@college.edu'  },
    ];
    for (const s of students) {
      const exists = await User.findOne({ email: s.email });
      if (!exists) {
        const u = await User.create({
          name: s.name,
          email: s.email,
          passwordHash: '$2b$10$abcdefghijklmnopqrstuv',
          role: 'STUDENT',
          status: 'PENDING',
          department: 'CSE'
        });
        await StudentProfile.create({ user: u._id, dept: 'CSE', year: 3, cgpa: 7.2, skills: ['C','Java'] });
      }
    }

    console.log('Seed complete. HOD: hod@college.edu');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
