const { FaceMesh } = require('@mediapipe/face_mesh');
const { Camera } = require('@mediapipe/camera_utils');
const cv = require('opencv4nodejs'); // Alternative: sharp for image processing
const fs = require('fs');
const path = require('path');

class FaceVerificationService {
  constructor() {
    this.faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    
    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
  }

  // Extract facial landmarks as features
  async extractFeatures(imageBuffer) {
    return new Promise((resolve, reject) => {
      const img = cv.imdecode(imageBuffer);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.cols;
      canvas.height = img.rows;
      
      // Convert OpenCV Mat to ImageData
      const imageData = new ImageData(
        new Uint8ClampedArray(img.getData()),
        img.cols,
        img.rows
      );
      
      ctx.putImageData(imageData, 0, 0);
      
      this.faceMesh.onResults((results) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          const landmarks = results.multiFaceLandmarks[0];
          // Extract key facial points for comparison
          const features = this.extractKeyPoints(landmarks);
          resolve(features);
        } else {
          reject(new Error('No face detected'));
        }
      });
      
      this.faceMesh.send({ image: canvas });
    });
  }

  // Extract key facial measurement points
  extractKeyPoints(landmarks) {
    const keyIndices = [
      10, 151, 9, 8, 168, 6, 197, 195, 5, 4, 1, 19, 94, 125,
      142, 36, 205, 206, 207, 213, 192, 147, 187, 207, 187,
      // Eye corners, nose tip, mouth corners, etc.
    ];
    
    const keyPoints = keyIndices.map(index => ({
      x: landmarks[index].x,
      y: landmarks[index].y,
      z: landmarks[index].z || 0
    }));
    
    // Calculate relative distances and ratios
    return this.calculateFacialMetrics(keyPoints);
  }

  calculateFacialMetrics(points) {
    const metrics = {};
    
    // Eye distance ratio
    if (points.length >= 4) {
      const eyeDistance = this.euclideanDistance(points[0], points[1]);
      const faceWidth = this.euclideanDistance(points[2], points[3]);
      metrics.eyeDistanceRatio = eyeDistance / faceWidth;
    }
    
    // Nose to mouth ratio
    // Add more facial proportion calculations
    
    return {
      points: points,
      metrics: metrics,
      timestamp: Date.now()
    };
  }

  euclideanDistance(p1, p2) {
    return Math.sqrt(
      Math.pow(p1.x - p2.x, 2) + 
      Math.pow(p1.y - p2.y, 2) + 
      Math.pow(p1.z - p2.z, 2)
    );
  }

  // Compare two feature sets
  compareFeatures(features1, features2, threshold = 0.3) {
    const points1 = features1.points;
    const points2 = features2.points;
    
    if (points1.length !== points2.length) {
      return { match: false, similarity: 0 };
    }
    
    let totalDistance = 0;
    for (let i = 0; i < points1.length; i++) {
      totalDistance += this.euclideanDistance(points1[i], points2[i]);
    }
    
    const avgDistance = totalDistance / points1.length;
    const similarity = Math.max(0, 1 - avgDistance);
    const match = similarity > threshold;
    
    return { match, similarity, distance: avgDistance };
  }
}

// Express route handlers
const faceService = new FaceVerificationService();

exports.verifyFace = async (req, res) => {
  try {
    const { reference } = req.body;
    if (!req.file || !reference) {
      return res.status(400).json({ message: 'Image and reference required' });
    }

    // Extract features from uploaded image
    const liveFeatures = await faceService.extractFeatures(req.file.buffer);
    
    // Load reference features
    const refPath = path.join(__dirname, `../reference/${reference}.json`);
    if (!fs.existsSync(refPath)) {
      return res.status(404).json({ message: 'Reference face not enrolled' });
    }
    
    const refFeatures = JSON.parse(fs.readFileSync(refPath));
    
    // Compare features
    const result = faceService.compareFeatures(liveFeatures, refFeatures);
    
    res.json({
      match: result.match,
      similarity: result.similarity,
      distance: result.distance
    });
    
  } catch (err) {
    console.error('Face verification error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.enrollFace = async (req, res) => {
  try {
    const { reference } = req.body;
    if (!req.file || !reference) {
      return res.status(400).json({ message: 'Image and reference required' });
    }

    // Extract features from reference image
    const features = await faceService.extractFeatures(req.file.buffer);
    
    // Save features as reference
    const refPath = path.join(__dirname, `../reference/${reference}.json`);
    const refDir = path.dirname(refPath);
    
    if (!fs.existsSync(refDir)) {
      fs.mkdirSync(refDir, { recursive: true });
    }
    
    fs.writeFileSync(refPath, JSON.stringify(features, null, 2));
    
    res.json({ message: 'Reference face enrolled successfully' });
    
  } catch (err) {
    console.error('Face enroll error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};