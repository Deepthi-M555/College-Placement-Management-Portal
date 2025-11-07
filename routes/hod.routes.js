// routes/hod.routes.js
const r = require('express').Router();
const hod = require('../controllers/hod.controller');

r.get('/approvals', hod.listPending);
r.post('/approve/:userId', hod.approve);
r.post('/reject/:userId', hod.reject);

r.get('/students', hod.listStudents);
r.post('/students/:userId', hod.updateStudent);

r.get('/reports/summary', hod.deptSummary);
r.get('/reports/students.xlsx', hod.exportExcel);

module.exports = r;
