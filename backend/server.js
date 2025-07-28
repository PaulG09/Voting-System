require('dotenv').config();
const pool = require('./config/db');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const faceRoutes = require('./routes/faceRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/face', faceRoutes);

pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database!');
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL database:', err);
    process.exit(1);
  });