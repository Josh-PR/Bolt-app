/*
  Add Director Tracking to Leagues and Tournaments

  Overview:
  This migration adds director_id columns to leagues and tournaments tables
  to track which director created each league/tournament. This enables
  directors to view and manage their own leagues and tournaments.

  Changes:
  1. Add director_id column to leagues table
  2. Add director_id column to tournaments table
  3. Create indexes for performance
  4. Update RLS policies to allow directors to manage only their own leagues/tournaments

  Security:
  - Directors can only update/delete their own leagues and tournaments
  - All authenticated users can still view all leagues and tournaments
*/

-- Add director_id to leagues table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leagues' AND column_name = 'director_id'
  ) THEN
    ALTER TABLE leagues ADD COLUMN director_id uuid REFERENCES users(id);
  END IF;
END $$;

-- Add director_id to tournaments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tournaments' AND column_name = 'director_id'
  ) THEN
    ALTER TABLE tournaments ADD COLUMN director_id uuid REFERENCES users(id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leagues_director_id ON leagues(director_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_director_id ON tournaments(director_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Directors can update tournaments" ON tournaments;
DROP POLICY IF EXISTS "Directors can delete tournaments" ON tournaments;

-- Create new policies for tournaments
CREATE POLICY "Directors can update own tournaments" ON tournaments
  FOR UPDATE TO authenticated
  USING (
    director_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'director'
    )
  )
  WITH CHECK (
    director_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'director'
    )
  );

CREATE POLICY "Directors can delete own tournaments" ON tournaments
  FOR DELETE TO authenticated
  USING (
    director_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'director'
    )
  );
