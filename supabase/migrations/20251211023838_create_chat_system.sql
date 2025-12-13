/*
# Chat System Database Schema

## Overview
This migration creates the complete database schema for a real-time chat messaging system
with support for team chats and direct messages.

## Tables Created

### 1. conversations
- Stores chat conversations (team chats and direct messages)
- Includes conversation type, title, and team association
- Tracks last message timestamp for sorting

### 2. messages
- Stores all chat messages with content and metadata
- Supports text, image, and system message types
- Tracks read status and message metadata

### 3. conversation_participants
- Junction table managing which users belong to which conversations
- Tracks last read timestamp for unread message counting
- Includes notification preferences per conversation

## Security
- All tables have Row Level Security (RLS) enabled
- Users can only access conversations they participate in
- Secure read and write policies based on participant membership

## Performance
- Optimized indexes on foreign keys and frequently queried columns
- Composite indexes for conversation participant lookups
- Timestamp indexes for message sorting and pagination

## Functions and Triggers
- Auto-update conversation last_message_at when new messages arrive
- Function to get unread message counts per conversation
- Function to mark all messages as read in a conversation
*/

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('team', 'direct')),
  title text,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content text,
  message_type text NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
  image_url text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create conversation_participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_read_at timestamptz DEFAULT now(),
  muted boolean NOT NULL DEFAULT false,
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);
CREATE INDEX IF NOT EXISTS idx_conversations_team_id ON conversations(team_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_conversation ON conversation_participants(user_id, conversation_id);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations table
CREATE POLICY "Users can view conversations they participate in" ON conversations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = conversations.id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update conversations they participate in" ON conversations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = conversations.id
      AND conversation_participants.user_id = auth.uid()
    )
  );

-- RLS Policies for messages table
CREATE POLICY "Users can view messages in their conversations" ON messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their conversations" ON messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
    AND sender_id = auth.uid()
  );

CREATE POLICY "Users can update own messages" ON messages
  FOR UPDATE TO authenticated
  USING (sender_id = auth.uid());

CREATE POLICY "Users can delete own messages" ON messages
  FOR DELETE TO authenticated
  USING (sender_id = auth.uid());

-- RLS Policies for conversation_participants table
CREATE POLICY "Users can view participants in their conversations" ON conversation_participants
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join conversations" ON conversation_participants
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own participant settings" ON conversation_participants
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can leave conversations" ON conversation_participants
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- Create triggers for updating timestamps
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversation_participants_updated_at BEFORE UPDATE ON conversation_participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update conversation last_message_at timestamp
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversation_last_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Function to get unread message count for a user in a conversation
CREATE OR REPLACE FUNCTION get_unread_count(p_conversation_id uuid, p_user_id uuid)
RETURNS integer AS $$
DECLARE
  unread_count integer;
  last_read timestamptz;
BEGIN
  -- Get the user's last read timestamp
  SELECT last_read_at INTO last_read
  FROM conversation_participants
  WHERE conversation_id = p_conversation_id
  AND user_id = p_user_id;
  
  -- Count messages after last read that aren't from the user
  SELECT COUNT(*)::integer INTO unread_count
  FROM messages
  WHERE conversation_id = p_conversation_id
  AND created_at > COALESCE(last_read, '1970-01-01'::timestamptz)
  AND sender_id != p_user_id;
  
  RETURN COALESCE(unread_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_read(p_conversation_id uuid, p_user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE conversation_participants
  SET last_read_at = now()
  WHERE conversation_id = p_conversation_id
  AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create or get direct message conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_direct_conversation(p_user1_id uuid, p_user2_id uuid)
RETURNS uuid AS $$
DECLARE
  conversation_id uuid;
BEGIN
  -- Check if conversation already exists between these two users
  SELECT c.id INTO conversation_id
  FROM conversations c
  WHERE c.type = 'direct'
  AND c.id IN (
    SELECT cp1.conversation_id
    FROM conversation_participants cp1
    WHERE cp1.user_id = p_user1_id
    INTERSECT
    SELECT cp2.conversation_id
    FROM conversation_participants cp2
    WHERE cp2.user_id = p_user2_id
  );
  
  -- If conversation doesn't exist, create it
  IF conversation_id IS NULL THEN
    INSERT INTO conversations (type)
    VALUES ('direct')
    RETURNING id INTO conversation_id;
    
    -- Add both participants
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES (conversation_id, p_user1_id), (conversation_id, p_user2_id);
  END IF;
  
  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;