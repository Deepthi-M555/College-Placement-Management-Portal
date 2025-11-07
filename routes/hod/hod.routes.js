// routes/hod.routes.js
const express = require('express');
const router = express.Router();
const Excel = require('exceljs');

// Models (adjust paths if your models live elsewhere)
const User = require('../../models/User.js');
const StudentProfile = require('../../models/StudentProfile.js');
const Application = require('../../models/Application.js');

/**
 * Helper: ensure departmentId exists on req.user
 */
function getDeptId(req) {
  // in your User model you use departmentId (not department)
  return req.user && (req.user.departmentId || req.user.department);
}

/**
 * GET  /hod/               -> HOD dashboard
 * GET  /hod/approvals      -> list pending student approvals (renders view)
 * POST /hod/approvals/:userId/approve  -> approve student
 * POST /hod/approvals/:userId/reject   -> reject student
 * GET  /hod/students       -> list approved students (with profiles)
 * POST /hod/students/:userId/update -> update student profile (year, cgpa, skills)
 * GET  /hod/summary        -> JSON summary counts for department
 * GET  /hod/export         -> download Excel of students
 * GET  /hod/reports        -> placeholder page for reports
 * GET  /hod/analytics      -> placeholder page for analytics
 */

/* Dashboard placeholder */
router.get('/', async (req, res, next) => {
  try {
    // Basic counts for dashboard - safe even if DB not connected (will throw if so)
    const deptId = getDeptId(req);
    const total = deptId ? await User.countDocuments({ role: 'STUDENT', departmentId: deptId }) : 0;
    const approved = deptId ? await User.countDocuments({ role: 'STUDENT', departmentId: deptId, status: 'APPROVED' }) : 0;
    res.render('hod/dashboard', { total, approved });
  } catch (err) {
    next(err);
  }
});

/* List pending approvals */
router.get('/approvals', async (req, res, next) => {
  try {
    const deptId = getDeptId(req);
    if (!deptId) return res.status(400).send('HOD department not set on your account.');
    const pending = await User.find({ role: 'STUDENT', status: 'PENDING', departmentId: deptId })
      .select('name email departmentId createdAt');
    res.render('hod/approvals', { pending });
  } catch (err) {
    next(err);
  }
});

/* Approve a student */
router.post('/approvals/:userId/approve', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deptId = getDeptId(req);
    const user = await User.findOne({ _id: userId, role: 'STUDENT', departmentId: deptId });
    if (!user) return res.status(404).send('User not found');
    user.status = 'APPROVED';
    user.isApproved = true;
    await user.save();

    // TODO: send email to student (you can call your mailer here)
    // e.g. require('../utils/mailer').sendApprovalEmail(user.email, ...)

    res.redirect('/hod/approvals');
  } catch (err) {
    next(err);
  }
});

/* Reject a student */
router.post('/approvals/:userId/reject', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deptId = getDeptId(req);
    const user = await User.findOne({ _id: userId, role: 'STUDENT', departmentId: deptId });
    if (!user) return res.status(404).send('User not found');
    user.status = 'REJECTED';
    user.isApproved = false;
    await user.save();

    // TODO: send rejection email to student

    res.redirect('/hod/approvals');
  } catch (err) {
    next(err);
  }
});

/* List approved students and their profiles */
router.get('/students', async (req, res, next) => {
  try {
    const deptId = getDeptId(req);
    if (!deptId) return res.status(400).send('HOD department not set on your account.');
    const q = (req.query.q || '').trim();
    const filter = { role: 'STUDENT', departmentId: deptId, status: 'APPROVED' };
    if (q) filter.$or = [{ email: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') }];

    const students = await User.find(filter).select('name email departmentId _id');
    const profs = await StudentProfile.find({ user: { $in: students.map(s => s._id) } });
    const profMap = Object.fromEntries(profs.map(p => [String(p.user), p]));
    res.render('hod/students', { students, profMap, q });
  } catch (err) {
    next(err);
  }
});

/* Update a student's profile (from HOD page) */
router.post('/students/:userId/update', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deptId = getDeptId(req);
    if (!deptId) return res.status(400).send('HOD department not set on your account.');

    const user = await User.findOne({ _id: userId, role: 'STUDENT', departmentId: deptId, status: 'APPROVED' });
    if (!user) return res.status(404).send('User not found');

    const year = req.body.year ? Number(req.body.year) : null;
    const cgpa = req.body.cgpa ? Number(req.body.cgpa) : null;
    const skills = (req.body.skills || '').split(',').map(s => s.trim()).filter(Boolean);

    await StudentProfile.updateOne(
      { user: userId },
      { $set: { year, cgpa, skills, departmentId: deptId } },
      { upsert: true }
    );

    res.redirect('/hod/students');
  } catch (err) {
    next(err);
  }
});

/* Department summary (JSON) */
router.get('/summary', async (req, res, next) => {
  try {
    const deptId = getDeptId(req);
    if (!deptId) return res.status(400).send('HOD department not set on your account.');

    const total = await User.countDocuments({ role: 'STUDENT', departmentId: deptId });
    const approved = await User.countDocuments({ role: 'STUDENT', departmentId: deptId, status: 'APPROVED' });

    const byStatus = await Application.aggregate([
      { $lookup: { from: 'users', localField: 'studentId', foreignField: '_id', as: 'stu' } },
      { $unwind: '$stu' },
      { $match: { 'stu.departmentId': deptId, 'stu.role': 'STUDENT', 'stu.status': 'APPROVED' } },
      { $group: { _id: '$currentStatus', count: { $sum: 1 } } }
    ]);

    const funnel = Object.fromEntries((byStatus || []).map(x => [x._id, x.count]));
    res.json({ deptId, total, approved, funnel });
  } catch (err) {
    next(err);
  }
});

/* Export approved students to Excel */
router.get('/export', async (req, res, next) => {
  try {
    const deptId = getDeptId(req);
    if (!deptId) return res.status(400).send('HOD department not set on your account.');

    const students = await User.find({ role: 'STUDENT', departmentId: deptId, status: 'APPROVED' })
      .select('name email departmentId _id');
    const profs = await StudentProfile.find({ user: { $in: students.map(s => s._id) } });
    const pmap = new Map(profs.map(p => [String(p.user), p]));

    const wb = new Excel.Workbook();
    const ws = wb.addWorksheet('Students');
    ws.columns = [
      { header: 'Name', key: 'name', width: 24 },
      { header: 'Email', key: 'email', width: 28 },
      { header: 'Dept', key: 'dept', width: 10 },
      { header: 'Year', key: 'year', width: 8 },
      { header: 'CGPA', key: 'cgpa', width: 8 },
      { header: 'Skills', key: 'skills', width: 40 },
    ];

    students.forEach(s => {
      const p = pmap.get(String(s._id)) || {};
      ws.addRow({
        name: s.name || '',
        email: s.email,
        dept: s.departmentId || '',
        year: p.year || '',
        cgpa: p.cgpa || '',
        skills: (p.skills || []).join(', ')
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="dept-students.xlsx"');
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    next(err);
  }
});

/* Placeholder pages */
router.get('/reports', (req, res) => {
  res.render('hod/reports', { message: 'Coming soon' });
});
router.get('/analytics', (req, res) => {
  res.render('hod/analytics', { message: 'Coming soon' });
});

module.exports = router;
