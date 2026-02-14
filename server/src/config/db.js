const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const db = mongoose.connection;

async function testConnection() {
  if (!MONGO_URI) {
    console.error('MONGO_URI is not set in environment');
    return false;
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Database connected (MongoDB)');
    return true;
  } catch (err) {
    console.error('Database connection failed:', err.message || err);
    return false;
  }
}

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('MongoDB connection open');
});

module.exports = { db, testConnection };
