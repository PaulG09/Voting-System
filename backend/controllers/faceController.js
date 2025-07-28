const faceapi = require('@vladmandic/face-api');
const canvas = require('canvas');
const path = require('path');
const fs = require('fs');

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Load models once at startup
const MODEL_PATH = path.join(__dirname, '../models/face');
let modelsLoaded = false;
async function loadModels() {
  if (!modelsLoaded) {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);
    modelsLoaded = true;
  }
}

// Helper to load image from file or buffer
async function loadImage(imageBuffer) {
  return await canvas.loadImage(imageBuffer);
}

// POST /api/face/verify
exports.verifyFace = async (req, res) => {
  try {
    await loadModels();
    const { reference } = req.body;
    if (!req.file || !reference) {
      return res.status(400).json({ message: 'Image and reference required' });
    }
    // Load live image
    const liveImage = await loadImage(req.file.buffer);
    const liveDetection = await faceapi.detectSingleFace(liveImage).withFaceLandmarks().withFaceDescriptor();
    if (!liveDetection) {
      return res.status(400).json({ message: 'No face detected in live image' });
    }
    // Load reference descriptor (for now, from file; later, from DB)
    const refPath = path.join(__dirname, `../reference/${reference}.json`);
    if (!fs.existsSync(refPath)) {
      return res.status(404).json({ message: 'Reference face not enrolled' });
    }
    const refDescriptor = JSON.parse(fs.readFileSync(refPath));
    // Compare descriptors
    const distance = faceapi.euclideanDistance(liveDetection.descriptor, refDescriptor);
    const threshold = 0.5; // Lower is stricter
    const match = distance < threshold;
    res.json({ match, distance });
  } catch (err) {
    console.error('Face verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/face/enroll
exports.enrollFace = async (req, res) => {
  try {
    await loadModels();
    const { reference } = req.body;
    if (!req.file || !reference) {
      return res.status(400).json({ message: 'Image and reference required' });
    }
    const image = await loadImage(req.file.buffer);
    const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor();
    if (!detection) {
      return res.status(400).json({ message: 'No face detected in image' });
    }
    // Save descriptor as reference
    const refPath = path.join(__dirname, `../reference/${reference}.json`);
    fs.writeFileSync(refPath, JSON.stringify(detection.descriptor));
    res.json({ message: 'Reference face enrolled' });
  } catch (err) {
    console.error('Face enroll error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
