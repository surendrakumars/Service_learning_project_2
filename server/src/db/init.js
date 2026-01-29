const { pool } = require('../config/db');
require('dotenv').config();

const initSchema = async () => {
  const client = await pool.connect();

  try {
    // Users/Admins table for login
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Students table
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        grade VARCHAR(50),
        father_name VARCHAR(255),
        mother_name VARCHAR(255),
        mobile_no VARCHAR(20),
        teacher VARCHAR(255),
        total_fees INTEGER DEFAULT 10000,
        fees_paid INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for faster student name search
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_students_name ON students(name)
    `);

    // Insert default admin user (email: admin@cambridgekids.com, password: admin123)
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash('admin123', 10);
    await client.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@cambridgekids.com', hash, 'Admin']
    );

    console.log('Database schema initialized successfully.');
  } catch (err) {
    console.error('Schema initialization failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

initSchema();
