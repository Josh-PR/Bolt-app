/*
# Add Location and Search Radius Fields

## Overview
This migration adds location-based functionality to the users and leagues tables.

## Changes Made

### 1. Users Table
- Added `location_latitude` and `location_longitude` for user's location
- Added `search_radius_miles` for user's preferred search radius

### 2. Leagues Table  
- Added `location_latitude` and `location_longitude` for league venue coordinates

## Usage
These fields enable distance-based sorting and filtering of leagues and teams based on user location preferences.
*/

-- Add location fields to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'location_latitude'
  ) THEN
    ALTER TABLE users ADD COLUMN location_latitude numeric(10,8);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'location_longitude'
  ) THEN
    ALTER TABLE users ADD COLUMN location_longitude numeric(11,8);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'search_radius_miles'
  ) THEN
    ALTER TABLE users ADD COLUMN search_radius_miles integer;
  END IF;
END $$;

-- Add location fields to leagues table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leagues' AND column_name = 'location_latitude'
  ) THEN
    ALTER TABLE leagues ADD COLUMN location_latitude numeric(10,8);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leagues' AND column_name = 'location_longitude'
  ) THEN
    ALTER TABLE leagues ADD COLUMN location_longitude numeric(11,8);
  END IF;
END $$;

-- Create indexes for location-based queries
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location_latitude, location_longitude);
CREATE INDEX IF NOT EXISTS idx_leagues_location ON leagues(location_latitude, location_longitude);

-- Update sample data with coordinates (New York area)
UPDATE leagues SET 
  location_latitude = 40.7829,
  location_longitude = -73.9654
WHERE name = 'Spring Recreation League';

UPDATE leagues SET 
  location_latitude = 40.7589,
  location_longitude = -73.9851
WHERE name = 'Competitive Summer League';

UPDATE leagues SET 
  location_latitude = 40.7505,
  location_longitude = -73.9934
WHERE name = 'Corporate League';

UPDATE leagues SET 
  location_latitude = 40.7282,
  location_longitude = -74.0776
WHERE name = 'Fall Classic League';

UPDATE leagues SET 
  location_latitude = 40.7831,
  location_longitude = -73.9712
WHERE name = 'Women''s Competitive League';

UPDATE leagues SET 
  location_latitude = 40.7614,
  location_longitude = -73.9776
WHERE name = 'Youth Development League';