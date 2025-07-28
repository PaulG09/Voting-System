const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { verifyFace, enrollFace } = require('../controllers/faceController');

// POST /api/face/verify
router.post('/verify', upload.single('image'), verifyFace);
// POST /api/face/enroll
router.post('/enroll', upload.single('image'), enrollFace);

module.exports = router;
