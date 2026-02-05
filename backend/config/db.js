// config/db.js - FIXED VERSION
const mysql = require('mysql2/promise');
require('dotenv').config();

const promisePool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
(async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('Database connection successful');
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();

module.exports = { promisePool };