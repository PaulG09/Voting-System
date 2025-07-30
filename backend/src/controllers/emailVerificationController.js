const { saveVerificationCode, getVerificationCode, setVerified, isVerified } = require('../models/emailVerificationModel');
const { sendPasswordEmail } = require('../utils/email');

// Generate a random 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/signup
const { findUserByReference } = require('../models/userModel');
exports.signup = async (req, res) => {
  try {
    const { reference, email } = req.body;
    if (!reference || !email) return res.status(400).json({ message: 'Reference and email required' });
    // Check email domain
    const emailLower = email.toLowerCase();
    if (!(
      emailLower.endsWith('@umat.edu.gh') ||
      emailLower.endsWith('@st.umat.edu.gh')
    )) {
      return res.status(400).json({ message: 'Please use your institutional email ending with @umat.edu.gh or @st.umat.edu.gh' });
    }
    // Check user exists and email matches
    const user = await findUserByReference(reference);
    if (!user || user.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(404).json({ message: 'No matching user found for provided reference and email' });
    }
    const code = generateCode();
    await saveVerificationCode(reference, code);
    await sendPasswordEmail(email, `Your verification code is: ${code}`);
    res.json({ message: 'Verification code sent to email' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { reference, code } = req.body;
    if (!reference || !code) return res.status(400).json({ message: 'Reference and code required' });
    const record = await getVerificationCode(reference);
    if (!record || record.code !== code) return res.status(400).json({ message: 'Invalid code' });
    await setVerified(reference);
    res.json({ message: 'Email verified' });
  } catch (err) {
    console.error('VerifyEmail error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/auth/is-verified/:reference
exports.isVerified = async (req, res) => {
  try {
    const { reference } = req.params;
    const verified = await isVerified(reference);
    res.json({ verified });
  } catch (err) {
    console.error('IsVerified error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
