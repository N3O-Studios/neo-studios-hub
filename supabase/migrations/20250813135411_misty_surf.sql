/*
  # User Credits System

  1. New Tables
    - `user_credits`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `credits` (integer, default 1000)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_credits` table
    - Add policies for users to read and update their own credits

  3. Functions
    - Trigger function to create credits record when user signs up
    - Function to deduct credits safely
*/

-- Create user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits integer DEFAULT 1000 NOT NULL CHECK (credits >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own credits"
  ON user_credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
  ON user_credits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user_credits()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (NEW.id, 1000);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created_credits ON auth.users;
CREATE TRIGGER on_auth_user_created_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_credits();

-- Create function to safely deduct credits
CREATE OR REPLACE FUNCTION deduct_credits(user_id_param uuid, amount integer)
RETURNS boolean AS $$
DECLARE
  current_credits integer;
BEGIN
  -- Get current credits with row lock
  SELECT credits INTO current_credits
  FROM user_credits
  WHERE user_id = user_id_param
  FOR UPDATE;
  
  -- Check if user has enough credits
  IF current_credits IS NULL OR current_credits < amount THEN
    RETURN false;
  END IF;
  
  -- Deduct credits
  UPDATE user_credits
  SET credits = credits - amount,
      updated_at = now()
  WHERE user_id = user_id_param;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add credits
CREATE OR REPLACE FUNCTION add_credits(user_id_param uuid, amount integer)
RETURNS boolean AS $$
BEGIN
  UPDATE user_credits
  SET credits = credits + amount,
      updated_at = now()
  WHERE user_id = user_id_param;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_updated_at ON user_credits(updated_at);