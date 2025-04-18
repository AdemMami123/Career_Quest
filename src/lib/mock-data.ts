import { 
  Badge, 
  BadgeRarity, 
  CandidateAnalytics, 
  Mission, 
  MissionCategory, 
  MissionDifficulty, 
  MissionStatus, 
  User, 
  UserProgress 
} from '../types';

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: 'badge-001',
    name: 'Problem Solver',
    description: 'Successfully completed 3 problem-solving missions',
    imageUrl: '/badges/problem-solver.svg',
    rarity: 'common' as BadgeRarity,
    category: 'problem-solving' as MissionCategory,
  },
  {
    id: 'badge-002',
    name: 'Team Captain',
    description: 'Demonstrated exceptional leadership skills',
    imageUrl: '/badges/team-captain.svg',
    rarity: 'rare' as BadgeRarity,
    category: 'leadership' as MissionCategory,
  },
  {
    id: 'badge-003',
    name: 'Code Wizard',
    description: 'Solved a difficult technical challenge',
    imageUrl: '/badges/code-wizard.svg',
    rarity: 'epic' as BadgeRarity,
    category: 'technical' as MissionCategory,
  },
  {
    id: 'badge-004',
    name: 'Effective Communicator',
    description: 'Successfully completed all communication challenges',
    imageUrl: '/badges/communicator.svg',
    rarity: 'uncommon' as BadgeRarity,
    category: 'communication' as MissionCategory,
  },
  {
    id: 'badge-005',
    name: 'Creative Genius',
    description: 'Demonstrated exceptional creativity in solutions',
    imageUrl: '/badges/creative-genius.svg',
    rarity: 'legendary' as BadgeRarity,
    category: 'creativity' as MissionCategory,
  },
];

// Mock Missions
export const mockMissions: Mission[] = [
  {
    id: 'mission-001',
    title: 'Debug the Code',
    description: 'Find and fix bugs in a sample application within the time limit.',
    category: 'technical' as MissionCategory,
    difficulty: 'medium' as MissionDifficulty,
    points: 100,
    timeLimit: 600, // 10 minutes
    status: 'not-started' as MissionStatus,
    tasks: [
      { id: 'task-001', description: 'Identify all bugs in the application', completed: false },
      { id: 'task-002', description: 'Fix the bugs without introducing new ones', completed: false },
      { id: 'task-003', description: 'Write tests to prevent regression', completed: false },
    ],
    requiredSkills: [
      { name: 'Debugging', category: 'technical' },
      { name: 'Problem Solving', category: 'problem-solving' },
    ],
    completionCriteria: 'All bugs must be fixed and tests must pass',
    badgeReward: mockBadges[2], // Code Wizard badge
  },
  {
    id: 'mission-002',
    title: 'Virtual Team Meeting',
    description: 'Lead a virtual team meeting to plan a project rollout.',
    category: 'leadership' as MissionCategory,
    difficulty: 'hard' as MissionDifficulty,
    points: 150,
    status: 'not-started' as MissionStatus,
    tasks: [
      { id: 'task-004', description: 'Prepare meeting agenda', completed: false },
      { id: 'task-005', description: 'Lead the team discussion', completed: false },
      { id: 'task-006', description: 'Address team concerns effectively', completed: false },
      { id: 'task-007', description: 'Assign tasks and follow up', completed: false },
    ],
    requiredSkills: [
      { name: 'Leadership', category: 'leadership' },
      { name: 'Communication', category: 'communication' },
    ],
    completionCriteria: 'Successfully lead the meeting and create an actionable plan',
    badgeReward: mockBadges[1], // Team Captain badge
  },
  {
    id: 'mission-003',
    title: 'Customer Service Simulation',
    description: 'Handle difficult customer scenarios through simulated chat interactions.',
    category: 'communication' as MissionCategory,
    difficulty: 'easy' as MissionDifficulty,
    points: 75,
    timeLimit: 900, // 15 minutes
    status: 'not-started' as MissionStatus,
    tasks: [
      { id: 'task-008', description: 'Respond to angry customer inquiry', completed: false },
      { id: 'task-009', description: 'Resolve billing dispute scenario', completed: false },
      { id: 'task-010', description: 'Upsell to an existing customer', completed: false },
    ],
    requiredSkills: [
      { name: 'Communication', category: 'communication' },
      { name: 'Problem Solving', category: 'problem-solving' },
    ],
    completionCriteria: 'Successfully resolve all customer scenarios with positive outcomes',
    badgeReward: mockBadges[3], // Effective Communicator badge
  },
  {
    id: 'mission-004',
    title: 'Product Innovation Challenge',
    description: 'Create an innovative solution to a common business problem.',
    category: 'creativity' as MissionCategory,
    difficulty: 'expert' as MissionDifficulty,
    points: 200,
    status: 'not-started' as MissionStatus,
    tasks: [
      { id: 'task-011', description: 'Identify a market gap or opportunity', completed: false },
      { id: 'task-012', description: 'Design a product or service concept', completed: false },
      { id: 'task-013', description: 'Create a presentation or prototype', completed: false },
      { id: 'task-014', description: 'Propose a go-to-market strategy', completed: false },
    ],
    requiredSkills: [
      { name: 'Creativity', category: 'creativity' },
      { name: 'Problem Solving', category: 'problem-solving' },
    ],
    completionCriteria: 'Present a compelling and innovative solution with market potential',
    badgeReward: mockBadges[4], // Creative Genius badge
  },
  {
    id: 'mission-005',
    title: 'Logic Puzzle Challenge',
    description: 'Solve a series of increasingly difficult logic puzzles.',
    category: 'problem-solving' as MissionCategory,
    difficulty: 'medium' as MissionDifficulty,
    points: 125,
    timeLimit: 1200, // 20 minutes
    status: 'not-started' as MissionStatus,
    tasks: [
      { id: 'task-015', description: 'Solve the beginner puzzles', completed: false },
      { id: 'task-016', description: 'Complete the intermediate challenges', completed: false },
      { id: 'task-017', description: 'Finish the expert-level puzzle', completed: false },
    ],
    requiredSkills: [
      { name: 'Logical Reasoning', category: 'problem-solving' },
      { name: 'Analytical Thinking', category: 'problem-solving' },
    ],
    completionCriteria: 'Successfully complete all puzzles with correct solutions',
    badgeReward: mockBadges[0], // Problem Solver badge
  },
];

// Mock User
export const mockUser: User = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  role: 'candidate',
  avatarUrl: '/avatars/alex.jpg',
  level: 3,
  experience: 375,
  skills: [
    { name: 'Problem Solving', level: 6, category: 'problem-solving' },
    { name: 'Communication', level: 7, category: 'communication' },
    { name: 'Leadership', level: 4, category: 'leadership' },
    { name: 'Technical', level: 8, category: 'technical' },
    { name: 'Creativity', level: 5, category: 'creativity' },
  ],
  badges: [mockBadges[0], mockBadges[3]],
  completedMissions: ['mission-003'],
  currentMission: 'mission-001',
};

// Mock HR User
export const mockHrUser: User = {
  id: 'hr-001',
  name: 'Sam Taylor',
  email: 'sam.taylor@company.com',
  role: 'hr',
  avatarUrl: '/avatars/sam.jpg',
  level: 10,
  experience: 2500,
  skills: [
    { name: 'Recruitment', level: 9, category: 'problem-solving' },
    { name: 'Communication', level: 8, category: 'communication' },
    { name: 'Leadership', level: 7, category: 'leadership' },
  ],
  badges: [],
  completedMissions: [],
};

// Mock Candidate Progress
export const mockUserProgress: UserProgress = {
  currentLevel: 3,
  experiencePoints: 375,
  nextLevelThreshold: 500,
  percentToNextLevel: 75,
  recentAchievements: [mockBadges[3]],
  skillProgress: {
    'problem-solving': 60,
    'leadership': 40,
    'communication': 70,
    'technical': 80,
    'creativity': 50,
  },
};

// Mock Analytics Data
export const mockCandidateAnalytics: CandidateAnalytics[] = [
  {
    userId: 'user-001',
    userName: 'Alex Johnson',
    completedMissions: 1,
    averageScore: 85,
    skillBreakdown: {
      'problem-solving': 6,
      'leadership': 4,
      'communication': 7,
      'technical': 8,
      'creativity': 5,
    },
    timeSpent: 45, // 45 minutes
    strengthAreas: ['technical', 'communication'],
    improvementAreas: ['leadership', 'creativity'],
  },
  {
    userId: 'user-002',
    userName: 'Jamie Smith',
    completedMissions: 3,
    averageScore: 92,
    skillBreakdown: {
      'problem-solving': 8,
      'leadership': 7,
      'communication': 8,
      'technical': 6,
      'creativity': 7,
    },
    timeSpent: 120, // 2 hours
    strengthAreas: ['problem-solving', 'communication'],
    improvementAreas: ['technical'],
  },
  {
    userId: 'user-003',
    userName: 'Morgan Lee',
    completedMissions: 2,
    averageScore: 78,
    skillBreakdown: {
      'problem-solving': 7,
      'leadership': 8,
      'communication': 6,
      'technical': 5,
      'creativity': 8,
    },
    timeSpent: 90, // 1.5 hours
    strengthAreas: ['leadership', 'creativity'],
    improvementAreas: ['technical', 'communication'],
  },
];

// Helper functions
export const getLevelRequirement = (level: number): number => {
  return level * 150 + 50;
};

export const calculateLevelFromXp = (xp: number): number => {
  let level = 1;
  let threshold = getLevelRequirement(level);
  
  while (xp >= threshold) {
    level += 1;
    threshold += getLevelRequirement(level);
  }
  
  return level;
};