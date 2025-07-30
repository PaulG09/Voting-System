-- Table for email verification codes
CREATE TABLE IF NOT EXISTS email_verifications (
  reference VARCHAR(10) PRIMARY KEY,
  code VARCHAR(10) NOT NULL,
  verified BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  reference VARCHAR(10) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  department VARCHAR(255),
  role VARCHAR(50) DEFAULT 'student' -- can be 'student', 'commissioner', 'admin'
);



-- First super user: Godwin Sallah
-- Password: set to a default (must be changed on first login)
-- Add 'current_level' column if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='current_level') THEN
    ALTER TABLE users ADD COLUMN current_level VARCHAR(10);
  END IF;
END $$;

INSERT INTO users (reference, email, password, name, department, role, current_level)
VALUES (
  '9011789921',
  'gsallah9921@st.umat.edu.gh',
  '$2a$10$QwQwQwQwQwQwQwQwQwQwQOeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw', -- placeholder hash
  'Godwin Sallah',
  'Electrical and Electronic Engineering (EL)',
  'super',
  '400'
)
ON CONFLICT (reference) DO NOTHING;
