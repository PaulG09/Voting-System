require('dotenv').config();
const pool = require('./src/config/db');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const faceRoutes = require('./src/routes/faceRoutes');
const { createFaceFeaturesTable } = require('./src/models/faceFeatureModel');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/face', faceRoutes);

pool.connect()
  .then(async () => {
    console.log('Connected to PostgreSQL database!');
    // Ensure face_features table exists
    await createFaceFeaturesTable();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL database:', err);
    process.exit(1);
  });
