const express = require('express');
const router = express.Router();
const { login, generateAndSendPassword } = require('../controllers/authController');
const { signup, verifyEmail, isVerified } = require('../controllers/emailVerificationController');


router.post('/login', login);
router.post('/generate-password', generateAndSendPassword);

// Email verification routes
router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.get('/is-verified/:reference', isVerified);

module.exports = router;
