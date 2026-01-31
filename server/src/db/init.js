const { db } = require('../config/db');
require('dotenv').config();

const bcrypt = require('bcrypt');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    grade TEXT,
    father_name TEXT,
    mother_name TEXT,
    mobile_no TEXT,
    teacher TEXT,
    total_fees INTEGER DEFAULT 10000,
    fees_paid INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

db.exec(`CREATE INDEX IF NOT EXISTS idx_students_name ON students(name)`);

const hash = bcrypt.hashSync('admin123', 10);
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (email, password_hash, name) VALUES (?, ?, ?)
`);
insertUser.run('admin@cambridgekids.com', hash, 'Admin');

console.log('Database schema initialized successfully (SQLite).');
console.log('Default login: admin@cambridgekids.com / admin123');
