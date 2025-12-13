/*
# Initial Database Schema for Softball League Management

## Overview
This migration creates the foundational database schema for a comprehensive softball league management system.

## Tables Created

### 1. users
- Stores user profiles for players, managers, and directors
- Extends Supabase auth.users with additional profile information
- Includes role-based access control

### 2. leagues
- Stores league information including seasons, skill levels, and registration details
- Supports different league types and statuses
- Includes pricing and capacity management

### 3. teams
- Stores team information linked to leagues and managers
- Tracks team composition, fees, and payment status
- Supports team logos and descriptions

### 4. players
- Stores player-specific information including positions and emergency contacts
- Tracks payment status and free agent availability
- Links players to teams and includes experience levels

### 5. transactions
- Stores all financial transactions for payments and fees
- Supports different payment types and statuses
- Includes payment method tracking

## Security
- All tables have Row Level Security (RLS) enabled
- Appropriate policies for each user role
- Secure access patterns for sensitive data

## Indexing
- Performance-optimized indexes on frequently queried columns
- Foreign key relationships properly indexed
*/

-- Create users table to extend auth.users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL CHECK (role IN ('player', 'manager', 'director')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create leagues table
CREATE TABLE IF NOT EXISTS leagues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  skill_level text NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'competitive')),
  location text NOT NULL,
  season_start date NOT NULL,
  season_end date NOT NULL,
  registration_deadline date NOT NULL,
  base_fee numeric(10,2) NOT NULL DEFAULT 0,
  max_teams integer NOT NULL DEFAULT 8,
  current_teams integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  league_id uuid NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  manager_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logo_url text,
  description text,
  max_players integer NOT NULL DEFAULT 15,
  current_players integer NOT NULL DEFAULT 0,
  total_fee numeric(10,2) NOT NULL DEFAULT 0,
  paid_amount numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'full', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  jersey_number integer,
  position text,
  emergency_contact text,
  emergency_phone text,
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  amount_paid numeric(10,2) NOT NULL DEFAULT 0,
  amount_due numeric(10,2) NOT NULL DEFAULT 0,
  is_free_agent boolean NOT NULL DEFAULT false,
  bio text,
  experience_level text NOT NULL DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id uuid NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('registration', 'equipment', 'late_fee', 'refund')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method text,
  transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE INDEX IF NOT EXISTS idx_leagues_status ON leagues(status);
CREATE INDEX IF NOT EXISTS idx_leagues_skill_level ON leagues(skill_level);
CREATE INDEX IF NOT EXISTS idx_leagues_registration_deadline ON leagues(registration_deadline);

CREATE INDEX IF NOT EXISTS idx_teams_league_id ON teams(league_id);
CREATE INDEX IF NOT EXISTS idx_teams_manager_id ON teams(manager_id);
CREATE INDEX IF NOT EXISTS idx_teams_status ON teams(status);

CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_players_is_free_agent ON players(is_free_agent);
CREATE INDEX IF NOT EXISTS idx_players_payment_status ON players(payment_status);

CREATE INDEX IF NOT EXISTS idx_transactions_player_id ON transactions(player_id);
CREATE INDEX IF NOT EXISTS idx_transactions_team_id ON transactions(team_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create RLS policies for leagues table
CREATE POLICY "Anyone can read leagues" ON leagues
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Directors can manage leagues" ON leagues
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'director'
    )
  );

-- Create RLS policies for teams table
CREATE POLICY "Anyone can read teams" ON teams
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Managers can manage own teams" ON teams
  FOR ALL TO authenticated
  USING (manager_id = auth.uid());

CREATE POLICY "Directors can manage all teams" ON teams
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'director'
    )
  );

-- Create RLS policies for players table
CREATE POLICY "Players can read own data" ON players
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Players can update own data" ON players
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Players can insert own data" ON players
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Managers can read their team players" ON players
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = players.team_id AND teams.manager_id = auth.uid()
    )
  );

CREATE POLICY "Managers can update their team players" ON players
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = players.team_id AND teams.manager_id = auth.uid()
    )
  );

CREATE POLICY "Directors can read all players" ON players
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'director'
    )
  );

-- Create RLS policies for transactions table
CREATE POLICY "Players can read own transactions" ON transactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM players
      WHERE players.id = transactions.player_id AND players.user_id = auth.uid()
    )
  );

CREATE POLICY "Managers can read their team transactions" ON transactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM teams
      WHERE teams.id = transactions.team_id AND teams.manager_id = auth.uid()
    )
  );

CREATE POLICY "Directors can read all transactions" ON transactions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'director'
    )
  );

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leagues_updated_at BEFORE UPDATE ON leagues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically update team current_players count
CREATE OR REPLACE FUNCTION update_team_player_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update current_players count for the team
  IF TG_OP = 'INSERT' THEN
    UPDATE teams 
    SET current_players = current_players + 1 
    WHERE id = NEW.team_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE teams 
    SET current_players = current_players - 1 
    WHERE id = OLD.team_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle team changes
    IF OLD.team_id IS DISTINCT FROM NEW.team_id THEN
      -- Decrement old team
      IF OLD.team_id IS NOT NULL THEN
        UPDATE teams 
        SET current_players = current_players - 1 
        WHERE id = OLD.team_id;
      END IF;
      -- Increment new team
      IF NEW.team_id IS NOT NULL THEN
        UPDATE teams 
        SET current_players = current_players + 1 
        WHERE id = NEW.team_id;
      END IF;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER team_player_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON players
  FOR EACH ROW EXECUTE FUNCTION update_team_player_count();

-- Create function to automatically update league current_teams count
CREATE OR REPLACE FUNCTION update_league_team_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE leagues 
    SET current_teams = current_teams + 1 
    WHERE id = NEW.league_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE leagues 
    SET current_teams = current_teams - 1 
    WHERE id = OLD.league_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle league changes
    IF OLD.league_id IS DISTINCT FROM NEW.league_id THEN
      UPDATE leagues 
      SET current_teams = current_teams - 1 
      WHERE id = OLD.league_id;
      UPDATE leagues 
      SET current_teams = current_teams + 1 
      WHERE id = NEW.league_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER league_team_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_league_team_count();