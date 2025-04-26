-- Career Quest Database Structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE mission_difficulty AS ENUM ('easy', 'medium', 'hard', 'expert');
CREATE TYPE mission_category AS ENUM ('problem-solving', 'leadership', 'communication', 'technical', 'creativity');
CREATE TYPE mission_status AS ENUM ('not-started', 'in-progress', 'completed', 'failed');
CREATE TYPE badge_rarity AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary');
CREATE TYPE user_role AS ENUM ('candidate', 'hr', 'admin');

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  rarity badge_rarity NOT NULL,
  category mission_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  category mission_category NOT NULL,
  min_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Missions
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category mission_category NOT NULL,
  difficulty mission_difficulty NOT NULL,
  points INTEGER NOT NULL,
  time_limit INTEGER, -- in seconds
  status mission_status NOT NULL DEFAULT 'not-started',
  completion_criteria TEXT NOT NULL,
  badge_reward_id UUID REFERENCES badges(id) NULL,
  created_by TEXT, -- Changed from UUID REFERENCES auth.users(id) to allow string IDs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mission Tasks
CREATE TABLE mission_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL, -- For ordering tasks within a mission
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mission Required Skills
CREATE TABLE mission_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id),
  skill_name TEXT NOT NULL,
  skill_category mission_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mission_id, skill_name)
);

-- User Profiles (extends auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'candidate',
  avatar_url TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  experience INTEGER NOT NULL DEFAULT 0,
  current_mission UUID REFERENCES missions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Skills
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  skill_level INTEGER NOT NULL CHECK (skill_level BETWEEN 1 AND 10),
  skill_category mission_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skill_name)
);

-- User Badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id),
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- User Missions (many-to-many relationship)
CREATE TABLE user_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id),
  mission_id UUID REFERENCES missions(id),
  status mission_status DEFAULT 'not-started',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  time_spent INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_missions_updated_at
BEFORE UPDATE ON missions
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_user_skills_updated_at
BEFORE UPDATE ON user_skills
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_user_missions_updated_at
BEFORE UPDATE ON user_missions
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- Initial data: Create some default skills
INSERT INTO skills (name, category) VALUES
('Problem Solving', 'problem-solving'),
('Critical Thinking', 'problem-solving'),
('Leadership', 'leadership'),
('Team Management', 'leadership'),
('Communication', 'communication'),
('Presentation', 'communication'),
('Coding', 'technical'),
('System Design', 'technical'),
('Creativity', 'creativity'),
('Innovation', 'creativity');