const { saveFaceFeatures, getFaceFeatures } = require('../models/faceFeatureModel');

// Enroll face: save landmarks/features in DB for the user
exports.enrollFace = async (req, res) => {
  try {
    const { reference, landmarks } = req.body;
    if (!reference || !landmarks) {
      return res.status(400).json({ message: 'Missing reference or landmarks' });
    }
    await saveFaceFeatures(reference, landmarks);
    return res.json({ message: 'Face features enrolled and saved successfully' });
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
    const threshold = 0.13; // Adjust as needed

    if (avgDist < threshold) {
      return res.json({ verified: true, avgDist });
    } else {
      return res.json({ verified: false, avgDist });
    }
  } catch (err) {
    res.status(500).json({ message: 'Face verification failed', error: err.message });
  }
};