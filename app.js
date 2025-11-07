// app.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const engine = require('ejs-mate');

const { requireAuth, requireRole } = require('./middleware/auth');

// --- DB connect ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/placement_portal';
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// --- Express app ---
const app = express();
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// --- TEMP: mock auth until real login is wired ---
// Replace this with proper session/JWT later.
app.use((req, _res, next) => {
  // If you want to simulate a logged-in HOD, set dept id here.
  // req.user = { _id: '000000000000000000000000', role: 'HOD', departmentId: '000000000000000000000000' };
  next();
});

// --- Routes ---
const hodRoutes = require('./routes/hod.routes');
app.use('/hod', requireAuth, requireRole('HOD'), hodRoutes);

// Basic home
app.get('/', (_req, res) => res.send('College Placement Management Portal'));

// Error pages fallbacks
app.use((req, res) => res.status(404).send('404 Not Found'));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send('500 Server Error');
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
