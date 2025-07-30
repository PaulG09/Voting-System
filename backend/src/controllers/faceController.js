const pool = require('../config/db');
const { saveFaceFeatures, getFaceFeatures } = require('../models/faceFeatureModel');

// Enroll face: save landmarks/features in DB for the user and mark as registered
exports.enrollFace = async (req, res) => {
  try {
    const { reference, landmarks } = req.body;
    if (!reference || !landmarks) {
      return res.status(400).json({ message: 'Missing reference or landmarks' });
    }

    // Check if user is already registered
    const result = await pool.query(
      `SELECT registered FROM users WHERE reference = $1`,
      [reference]
    );
    if (!result.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (result.rows[0].registered) {
      return res.status(409).json({ message: 'User already registered' });
    }

    await saveFaceFeatures(reference, landmarks);

    // Mark user as registered
    await pool.query(
      `UPDATE users SET registered = TRUE WHERE reference = $1`,
      [reference]
    );

    return res.json({ message: 'Face features enrolled and user marked as registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Face enrollment failed', error: err.message });
  }
};

// Verify face: compare provided landmarks/features with those stored in DB
exports.verifyFace = async (req, res) => {
  try {
    const { reference, landmarks } = req.body;
    if (!reference || !landmarks) {
      return res.status(400).json({ message: 'Missing reference or landmarks' });
    }
    const storedLandmarks = await getFaceFeatures(reference);
    if (!storedLandmarks) {
      return res.status(404).json({ message: 'No enrolled face features found for this user' });
    }
    // Simple comparison: average Euclidean distance
    let totalDist = 0;
    for (let i = 0; i < storedLandmarks.length; i++) {
      const dx = storedLandmarks[i].x - landmarks[i].x;
      const dy = storedLandmarks[i].y - landmarks[i].y;
      const dz = storedLandmarks[i].z - landmarks[i].z;
      totalDist += Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    const avgDist = totalDist / storedLandmarks.length;
    const threshold = 0.10; // Increased threshold for more tolerance

    if (avgDist < threshold) {
      return res.json({ verified: true, avgDist });
    } else {
      return res.json({ verified: false, avgDist });
    }
  } catch (err) {
    res.status(500).json({ message: 'Face verification failed', error: err.message });
  }
};