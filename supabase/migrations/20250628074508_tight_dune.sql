/*
  # Add chat features for hamburger menu

  1. New Columns
    - Add `chat_type` column to saved_chats table to distinguish between music, developer, and general chats
    - Add `is_favorited` column to saved_chats table for favorite functionality

  2. Security
    - Maintain existing RLS policies
    - No changes to existing security model
*/

-- Add chat_type column to saved_chats table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_chats' AND column_name = 'chat_type'
  ) THEN
    ALTER TABLE public.saved_chats ADD COLUMN chat_type TEXT DEFAULT 'general';
  END IF;
END $$;

-- Add is_favorited column to saved_chats table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_chats' AND column_name = 'is_favorited'
  ) THEN
    ALTER TABLE public.saved_chats ADD COLUMN is_favorited BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create index for better performance on chat queries
CREATE INDEX IF NOT EXISTS idx_saved_chats_user_type ON public.saved_chats(user_id, chat_type);
CREATE INDEX IF NOT EXISTS idx_saved_chats_favorited ON public.saved_chats(user_id, is_favorited);