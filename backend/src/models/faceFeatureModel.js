const db = require('../config/db');

const createFaceFeaturesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS face_features (
      id SERIAL PRIMARY KEY,
      user_reference VARCHAR(10) UNIQUE NOT NULL,
      features JSON NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_user_reference FOREIGN KEY(user_reference) REFERENCES users(reference) ON DELETE CASCADE
    );
  `;
  await db.query(query);
};

const saveFaceFeatures = async (userReference, features) => {
  const query = `
    INSERT INTO face_features (user_reference, features)
    VALUES ($1, $2)
    ON CONFLICT (user_reference) DO UPDATE SET features = EXCLUDED.features, created_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  // Stringify features to ensure valid JSON input
  const values = [userReference, JSON.stringify(features)];
  const result = await db.query(query, values);
  return result.rows[0];
};

const getFaceFeatures = async (userReference) => {
  const query = `
    SELECT features FROM face_features WHERE user_reference = $1;
  `;
  const values = [userReference];
  const result = await db.query(query, values);
  return result.rows[0] ? result.rows[0].features : null;
};

module.exports = {
  createFaceFeaturesTable,
  saveFaceFeatures,
  getFaceFeatures,
};
