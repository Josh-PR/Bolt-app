/*
  Create tournaments table

  Overview:
  This migration creates a tournaments table for managing tournament competitions.
  Tournaments are similar to leagues but are typically one-time events rather than ongoing seasons.

  New Tables:
  
  tournaments table:
  - id (uuid, primary key) - Unique identifier
  - name (text) - Tournament name
  - description (text, nullable) - Tournament description
  - skill_level (text) - Skill level requirement
  - location (text) - Tournament location
  - start_date (date) - Tournament start date
  - end_date (date) - Tournament end date
  - registration_deadline (date) - Deadline for registration
  - entry_fee (numeric) - Fee per team to enter
  - max_teams (integer) - Maximum number of teams allowed
  - current_teams (integer) - Current number of registered teams
  - format (text) - Tournament format (single_elimination, double_elimination, round_robin, pool_play)
  - prize_pool (numeric, nullable) - Total prize money available
  - status (text) - Tournament status (open, full, in_progress, completed, cancelled)
  - created_at (timestamptz) - Creation timestamp
  - updated_at (timestamptz) - Last update timestamp

  Security:
  - RLS enabled on tournaments table
  - Anyone authenticated can read tournaments
  - Only directors can create, update, or delete tournaments

  Important Notes:
  1. Tournaments are separate from leagues to allow different management workflows
  2. Format determines the bracket structure and game scheduling
  3. Prize pool is optional and tracks total available winnings
*/

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  skill_level text NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'competitive')),
  location text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  registration_deadline date NOT NULL,
  entry_fee numeric(10,2) NOT NULL DEFAULT 0,
  max_teams integer NOT NULL DEFAULT 8,
  current_teams integer NOT NULL DEFAULT 0,
  format text NOT NULL DEFAULT 'single_elimination' CHECK (format IN ('single_elimination', 'double_elimination', 'round_robin', 'pool_play')),
  prize_pool numeric(10,2),
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_skill_level ON tournaments(skill_level);
CREATE INDEX IF NOT EXISTS idx_tournaments_registration_deadline ON tournaments(registration_deadline);
CREATE INDEX IF NOT EXISTS idx_tournaments_start_date ON tournaments(start_date);

-- Enable Row Level Security
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tournaments table
CREATE POLICY "Anyone can read tournaments" ON tournaments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Directors can insert tournaments" ON tournaments
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'director'
    )
  );

CREATE POLICY "Directors can update tournaments" ON tournaments
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'director'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'director'
    )
  );

CREATE POLICY "Directors can delete tournaments" ON tournaments
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'director'
    )
  );

-- Create trigger for updating timestamps
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();