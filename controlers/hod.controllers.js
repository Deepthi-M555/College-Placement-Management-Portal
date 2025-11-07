// controllers/hod.controller.js
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Application = require('../models/Application');
const Excel = require('exceljs');

// List students in THIS HOD's department awaiting approval
exports.listPending = async (req, res) => {
  const dept = req.user.departmentId;                         // ✅ departmentId
  const pending = await User.find({
    role: 'STUDENT',
    isApproved: false,                                        // ✅ isApproved
    departmentId: dept                                        // ✅ departmentId
  }).select('name email departmentId createdAt');
  res.render('hod/approvals', { pending });
};

// Approve one student (must belong to HOD's dept)
exports.approve = async (req, res) => {
  const { userId } = req.params;
  const dept = req.user.departmentId;                         // ✅ departmentId
  const u = await User.findOne({ _id: userId, role: 'STUDENT', departmentId: dept });
  if (!u) return res.status(404).send('Not found');
  u.isApproved = true;                                        // ✅ isApproved
  await u.save();
  res.redirect('/hod/approvals');
};

// Reject one student (must belong to HOD's dept)
exports.reject = async (req, res) => {
  const { userId } = req.params;
  const dept = req.user.departmentId;                         // ✅ departmentId
  const u = await User.findOne({ _id: userId, role: 'STUDENT', departmentId: dept });
  if (!u) return res.status(404).send('Not found');
  u.isApproved = false;                                       // ✅ isApproved
  await u.save();
  res.redirect('/hod/approvals');
};

// List approved students in dept (+ inline edit profile fields)
exports.listStudents = async (req, res) => {
  const dept = req.user.departmentId;                         // ✅ departmentId
  const q = (req.query.q || '').trim();
  const filter = { role: 'STUDENT', departmentId: dept, isApproved: true }; // ✅ isApproved
  if (q) filter.$or = [{ email: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') }];

  const students = await User.find(filter).select('name email departmentId _id');
  const profs = await StudentProfile.find({ user: { $in: students.map(s => s._id) } });
  const profMap = Object.fromEntries(profs.map(p => [String(p.user), p]));
  res.render('hod/students', { students, profMap, q });
};

// Update basic profile fields for a student in HOD's dept
exports.updateStudent = async (req, res) => {
  const { userId } = req.params;
  const dept = req.user.departmentId;                         // ✅ departmentId
  const user = await User.findOne({ _id: userId, role: 'STUDENT', departmentId: dept, isApproved: true }); // ✅ isApproved
  if (!user) return res.status(404).send('Not found');

  const year = req.body.year ? Number(req.body.year) : null;
  const cgpa = req.body.cgpa ? Number(req.body.cgpa) : null;
  const skills = (req.body.skills || '').split(',').map(s => s.trim()).filter(Boolean);

  await StudentProfile.updateOne(
    { user: userId },
    { $set: { year, cgpa, skills /* do NOT overwrite dept if it's a string and your user has ObjectId */ } },
    { upsert: true }
  );
  res.redirect('/hod/students');
};

// Dept summary (counts + application funnel by currentStatus)
exports.deptSummary = async (req, res) => {
  const dept = req.user.departmentId;                         // ✅ departmentId

  const total = await User.countDocuments({ role: 'STUDENT', departmentId: dept });
  const approved = await User.countDocuments({ role: 'STUDENT', departmentId: dept, isApproved: true }); // ✅ isApproved

  const byStatus = await Application.aggregate([
    { $lookup: { from: 'users', localField: 'studentId', foreignField: '_id', as: 'stu' } }, // ✅ studentId
    { $unwind: '$stu' },
    { $match: { 'stu.departmentId': dept, 'stu.role': 'STUDENT', 'stu.isApproved': true } }, // ✅ departmentId/isApproved
    { $group: { _id: '$currentStatus', count: { $sum: 1 } } }                                 // ✅ currentStatus
  ]);

  const funnel = Object.fromEntries(byStatus.map(x => [x._id, x.count]));
  res.json({ dept, total, approved, funnel });
};

// Excel export of approved students in dept
exports.exportExcel = async (req, res) => {
  const dept = req.user.departmentId;                         // ✅ departmentId
  const students = await User.find({ role: 'STUDENT', departmentId: dept, isApproved: true })
    .select('name email departmentId _id');
  const profs = await StudentProfile.find({ user: { $in: students.map(s => s._id) } });
  const pmap = new Map(profs.map(p => [String(p.user), p]));

  const wb = new Excel.Workbook();
  const ws = wb.addWorksheet('Students');
  ws.columns = [
    { header: 'Name',  key: 'name',  width: 24 },
    { header: 'Email', key: 'email', width: 28 },
    { header: 'DeptId',key: 'dept',  width: 22 },  // shows ObjectId unless you populate Department.name
    { header: 'Year',  key: 'year',  width: 8  },
    { header: 'CGPA',  key: 'cgpa',  width: 8  },
    { header: 'Skills',key: 'skills',width: 40 },
  ];
  students.forEach(s => {
    const p = pmap.get(String(s._id)) || {};
    ws.addRow({
      name:  s.name || '',
      email: s.email,
      dept:  String(s.departmentId || ''),          // prints the ObjectId; populate if you want name
      year:  p.year || '',
      cgpa:  p.cgpa || '',
      skills:(p.skills || []).join(', ')
    });
  });

  res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition','attachment; filename="dept-students.xlsx"');
  await wb.xlsx.write(res);
  res.end();
};
