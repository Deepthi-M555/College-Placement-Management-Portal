/**
 * config/db.js
 * Robust DB connector for dev/prod:
 * - uses either MONGO_URI or MONGODB_URI
 * - skips DB connection in development when empty
 * - throws in production if no URI
 */

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || '';

async function connectDB() {
  if (!MONGODB_URI) {
    if (process.env.NODE_ENV === 'production') {
      // In production we want to fail fast if DB missing
      const msg = 'MONGO_URI / MONGODB_URI is missing in production environment';
      console.error('❌ Failed to connect to DB:', msg);
      throw new Error(msg);
    }
    // Development: skip connection but allow server to start
    console.warn('⚠️  No MongoDB URI found. Skipping DB connection (development mode).');
    return Promise.resolve();
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    return mongoose;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = connectDB;
