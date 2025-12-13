/*
  # Add Questionnaire Tracking to Users and Players

  1. New Fields in users table
    - `questionnaire_completed` (boolean, default false)
    - `questionnaire_started_at` (timestamp)
    - `location_latitude` (numeric)
    - `location_longitude` (numeric)
    - `search_radius_miles` (numeric)

  2. Security
    - RLS policies already configured for users table
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'questionnaire_completed'
  ) THEN
    ALTER TABLE users ADD COLUMN questionnaire_completed boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'questionnaire_started_at'
  ) THEN
    ALTER TABLE users ADD COLUMN questionnaire_started_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'location_latitude'
  ) THEN
    ALTER TABLE users ADD COLUMN location_latitude numeric(11,8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'location_longitude'
  ) THEN
    ALTER TABLE users ADD COLUMN location_longitude numeric(11,8);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'search_radius_miles'
  ) THEN
    ALTER TABLE users ADD COLUMN search_radius_miles numeric(5,2) DEFAULT 25;
  END IF;
END $$;
