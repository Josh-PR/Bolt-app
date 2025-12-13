/*
# Add League Conversations Support

## Overview
This migration extends the chat system to support location-based league conversations,
allowing users to discover and join conversations for leagues near them.

## Changes Made

### 1. Conversations Table
- Updated conversation type to include 'league' type
- Added `league_id` foreign key to link conversations to leagues
- Added index for league conversations

### 2. RLS Policies
- Added policy for users to view league conversations within their search radius
- Added policy for users to join public league conversations

## Features
- Users can discover league conversations based on their location
- Distance-based filtering using user's search_radius_miles preference
- Public league conversations that anyone can join
*/

-- Update conversation type to include 'league'
DO $$
BEGIN
  -- Drop the existing constraint
  ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_type_check;
  
  -- Add new constraint with 'league' type
  ALTER TABLE conversations ADD CONSTRAINT conversations_type_check 
    CHECK (type IN ('team', 'direct', 'league'));
END $$;

-- Add league_id to conversations table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conversations' AND column_name = 'league_id'
  ) THEN
    ALTER TABLE conversations ADD COLUMN league_id uuid REFERENCES leagues(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add is_public flag for league conversations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'conversations' AND column_name = 'is_public'
  ) THEN
    ALTER TABLE conversations ADD COLUMN is_public boolean DEFAULT false;
  END IF;
END $$;

-- Create index for league conversations
CREATE INDEX IF NOT EXISTS idx_conversations_league_id ON conversations(league_id);
CREATE INDEX IF NOT EXISTS idx_conversations_is_public ON conversations(is_public);

-- Add RLS policy for users to view public league conversations
CREATE POLICY "Users can view public league conversations" ON conversations
  FOR SELECT TO authenticated
  USING (
    type = 'league' AND is_public = true
  );

-- Add RLS policy for users to join league conversations
CREATE POLICY "Users can join league conversations" ON conversation_participants
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_participants.conversation_id
      AND conversations.type = 'league'
      AND conversations.is_public = true
    )
  );

-- Function to get nearby league conversations
CREATE OR REPLACE FUNCTION get_nearby_league_conversations(
  p_user_latitude numeric,
  p_user_longitude numeric,
  p_radius_miles integer
)
RETURNS TABLE (
  conversation_id uuid,
  league_id uuid,
  league_name text,
  league_location text,
  distance_miles numeric,
  participant_count bigint,
  is_member boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as conversation_id,
    l.id as league_id,
    l.name as league_name,
    l.location as league_location,
    -- Calculate distance using Haversine formula
    (
      3959 * acos(
        cos(radians(p_user_latitude)) * 
        cos(radians(l.location_latitude)) * 
        cos(radians(l.location_longitude) - radians(p_user_longitude)) + 
        sin(radians(p_user_latitude)) * 
        sin(radians(l.location_latitude))
      )
    )::numeric(10,2) as distance_miles,
    (SELECT COUNT(*) FROM conversation_participants WHERE conversation_id = c.id) as participant_count,
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = c.id AND cp.user_id = auth.uid()
    ) as is_member
  FROM conversations c
  JOIN leagues l ON c.league_id = l.id
  WHERE c.type = 'league'
    AND c.is_public = true
    AND l.location_latitude IS NOT NULL
    AND l.location_longitude IS NOT NULL
    AND (
      3959 * acos(
        cos(radians(p_user_latitude)) * 
        cos(radians(l.location_latitude)) * 
        cos(radians(l.location_longitude) - radians(p_user_longitude)) + 
        sin(radians(p_user_latitude)) * 
        sin(radians(l.location_latitude))
      )
    ) <= p_radius_miles
  ORDER BY distance_miles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a league conversation
CREATE OR REPLACE FUNCTION create_league_conversation(
  p_league_id uuid,
  p_title text
)
RETURNS uuid AS $$
DECLARE
  v_conversation_id uuid;
BEGIN
  -- Check if conversation already exists for this league
  SELECT id INTO v_conversation_id
  FROM conversations
  WHERE league_id = p_league_id AND type = 'league';
  
  -- If not exists, create it
  IF v_conversation_id IS NULL THEN
    INSERT INTO conversations (type, league_id, title, is_public)
    VALUES ('league', p_league_id, p_title, true)
    RETURNING id INTO v_conversation_id;
  END IF;
  
  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;