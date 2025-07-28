const pool = require('../config/db');

// Save verification code for a user
const saveVerificationCode = async (reference, code) => {
  await pool.query(
    'INSERT INTO email_verifications (reference, code, verified) VALUES ($1, $2, false) ON CONFLICT (reference) DO UPDATE SET code = $2, verified = false',
    [reference, code]
  );
};

// Get verification code for a user
const getVerificationCode = async (reference) => {
  const res = await pool.query('SELECT * FROM email_verifications WHERE reference = $1', [reference]);
  return res.rows[0];
};

// Mark as verified
const setVerified = async (reference) => {
  await pool.query('UPDATE email_verifications SET verified = true WHERE reference = $1', [reference]);
};

// Check if verified
const isVerified = async (reference) => {
  const res = await pool.query('SELECT verified FROM email_verifications WHERE reference = $1', [reference]);
  return res.rows[0]?.verified === true;
};

module.exports = { saveVerificationCode, getVerificationCode, setVerified, isVerified };
