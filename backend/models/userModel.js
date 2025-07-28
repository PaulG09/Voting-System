// User model for PostgreSQL using pg
const pool = require('../config/db');

const createUser = async (user) => {
  const { reference, email, password, name, department, role = 'student' } = user;
  const res = await pool.query(
    'INSERT INTO users (reference, email, password, name, department, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [reference, email, password, name, department, role]
  );
  return res.rows[0];
};


const findUserByReference = async (reference) => {
  const res = await pool.query('SELECT * FROM users WHERE reference = $1', [reference]);
  return res.rows[0];
};

const updateUserPassword = async (email, password) => {
  const res = await pool.query('UPDATE users SET password = $1 WHERE email = $2 RETURNING *', [password, email]);
  return res.rows[0];
};

module.exports = { createUser, findUserByReference, updateUserPassword };
