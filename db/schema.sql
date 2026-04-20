-- BlockCTF Registration Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  team_name VARCHAR(100) NOT NULL,
  team_size INTEGER NOT NULL,
  members JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_team_size CHECK (team_size IN (1, 2))
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_registrations_team_name ON registrations(team_name);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key VARCHAR(50) NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_setting_key UNIQUE(key)
);

-- Insert default settings
INSERT INTO settings (key, value) VALUES 
  ('registrations_open', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for open registration
CREATE POLICY "Enable insert for all users" ON registrations
  FOR INSERT WITH CHECK (true);
