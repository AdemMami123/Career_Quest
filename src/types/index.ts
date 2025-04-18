// Mission Types
export type MissionDifficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type MissionCategory = 'problem-solving' | 'leadership' | 'communication' | 'technical' | 'creativity';
export type MissionStatus = 'not-started' | 'in-progress' | 'completed' | 'failed';

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  points: number;
  timeLimit?: number; // in seconds
  status: MissionStatus;
  tasks: MissionTask[];
  requiredSkills: Skill[];
  completionCriteria: string;
  badgeReward?: Badge;
}

export interface MissionTask {
  id: string;
  description: string;
  completed: boolean;
}

// Badge Types
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rarity: BadgeRarity;
  acquiredAt?: Date;
  category: MissionCategory;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'hr' | 'admin';
  avatarUrl?: string;
  level: number;
  experience: number;
  skills: UserSkill[];
  badges: Badge[];
  completedMissions: string[]; // Mission IDs
  currentMission?: string; // Mission ID
}

export interface UserSkill {
  name: string;
  level: number; // 1-10
  category: MissionCategory;
}

export interface Skill {
  name: string;
  category: MissionCategory;
  minLevel?: number;
}

// HR Analytics Types
export interface CandidateAnalytics {
  userId: string;
  userName: string;
  completedMissions: number;
  averageScore: number;
  skillBreakdown: Record<MissionCategory, number>; // Category to skill level mapping
  timeSpent: number; // in minutes
  strengthAreas: MissionCategory[];
  improvementAreas: MissionCategory[];
}

// Progress Types
export interface UserProgress {
  currentLevel: number;
  experiencePoints: number;
  nextLevelThreshold: number;
  percentToNextLevel: number;
  recentAchievements: Badge[];
  skillProgress: Record<MissionCategory, number>; // 0-100 percentage
}