const express = require('express');
const multer = require('multer');
const faceController = require('../controllers/faceController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// POST /api/face/enroll
router.post('/enroll', upload.single('image'), faceController.enrollFace);
// POST /api/face/verify
router.post('/verify', upload.single('image'), faceController.verifyFace);

module.exports = router;
