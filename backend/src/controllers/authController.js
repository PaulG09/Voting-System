const bcrypt = require('bcryptjs');
const { findUserByReference, updateUserPassword } = require('../models/userModel');
const { sendPasswordEmail } = require('../utils/email');
const { generateRandomPassword } = require('../utils/password');

// Login controller
exports.login = async (req, res) => {
  const { reference, password } = req.body;
  try {
    const user = await findUserByReference(reference);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', user: { reference: user.reference, email: user.email, name: user.name, department: user.department, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Generate and display password (admin action, for testing)
exports.generateAndSendPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Always generate a new password
    const userPassword = generateRandomPassword(10);
    const hash = await bcrypt.hash(userPassword, 10);
    await updateUserPassword(email, hash);
    // For testing: display password in response instead of sending email
    res.json({ message: 'Password generated for user', password: userPassword });
  } catch (err) {
    console.error('GenerateAndSendPassword error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
