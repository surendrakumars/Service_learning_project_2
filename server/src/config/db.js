const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.DB_PATH || path.join(dataDir, 'cambridge_kids.db');
const db = new Database(dbPath);

function toSqliteSql(sql) {
  return sql.replace(/\$(\d+)/g, '?');
}

function query(sql, params = []) {
  const sqliteSql = toSqliteSql(sql);
  const stmt = db.prepare(sqliteSql);

  let rows;
  try {
    rows = params.length ? stmt.all(...params) : stmt.all();
  } catch (err) {
    return Promise.reject(err);
  }
  return Promise.resolve({ rows: Array.isArray(rows) ? rows : (rows ? [rows] : []) });
}

const testConnection = async () => {
  try {
    db.prepare('SELECT 1').get();
    console.log('Database connected (SQLite)');
    return true;
  } catch (err) {
    console.error('Database connection failed:', err.message);
    return false;
  }
};

module.exports = { db, query, testConnection };
