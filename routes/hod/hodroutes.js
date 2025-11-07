const r = require('express').Router();
const hod = require('../controllers/hod.controller');

r.get('/approvals', hod.listPending);
r.post('/approve/:userId', hod.approve);
r.post('/reject/:userId', hod.reject);

r.get('/students', hod.listStudents);           // ?q=&page=1
r.post('/students/:userId', hod.updateStudent); // limited fields

r.get('/reports/summary', hod.deptSummary);     // JSON for UI
r.get('/reports/students.xlsx', hod.exportExcel);

module.exports = r;
