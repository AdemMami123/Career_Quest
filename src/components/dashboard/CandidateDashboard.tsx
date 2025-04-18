import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mission, Badge, UserProgress } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import MissionCard from '../missions/MissionCard';
import BadgeComponent from '../badges/Badge';
import { getLevelRequirement } from '../../lib/mock-data';
import { Brain, Code, Lightbulb, MessageSquare, Users } from 'lucide-react';

interface CandidateDashboardProps {
  user: User;
  missions: Mission[];
  userProgress: UserProgress;
  onSelectMission: (missionId: string) => void;
}

const CandidateDashboard: React.FC<CandidateDashboardProps> = ({
  user,
  missions,
  userProgress,
  onSelectMission,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Filter missions for current user (available or in progress)
  const availableMissions = missions.filter(
    mission => mission.status === 'not-started' || mission.status === 'in-progress'
  ).slice(0, 3); // Show max 3

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'problem-solving':
        return <Brain className="h-4 w-4" />;
      case 'technical':
        return <Code className="h-4 w-4" />;
      case 'creativity':
        return <Lightbulb className="h-4 w-4" />;
      case 'communication':
        return <MessageSquare className="h-4 w-4" />;
      case 'leadership':
        return <Users className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  // Calculate total completed missions
  const totalCompletedMissions = user.completedMissions?.length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white p-6 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-primary-100">
              You're currently at Level {user.level} with {user.experience} XP. 
              {user.currentMission 
                ? ' You have an active mission in progress.' 
                : ' Ready to take on a new mission?'}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="bg-white/20 text-white px-4 py-2 rounded-lg inline-block text-sm">
              {totalCompletedMissions} {totalCompletedMissions === 1 ? 'Mission' : 'Missions'} Completed
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Available Missions */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Your Missions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableMissions.length > 0 ? (
                availableMissions.map((mission) => (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    onSelect={onSelectMission}
                  />
                ))
              ) : (
                <div className="col-span-2 bg-white p-6 rounded-lg shadow text-center">
                  <p className="text-gray-500">No missions available at the moment.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Skills Progress */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Your Skills</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="space-y-4">
                {Object.entries(userProgress.skillProgress).map(([skill, progress]) => (
                  <div key={skill} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(skill)}
                        <span className="text-sm font-medium capitalize">{skill}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-500">{progress}%</span>
                    </div>
                    <ProgressBar
                      value={progress}
                      max={100}
                      size="sm"
                      color={
                        skill === 'problem-solving' ? 'bg-blue-500' :
                        skill === 'leadership' ? 'bg-purple-500' :
                        skill === 'communication' ? 'bg-green-500' :
                        skill === 'technical' ? 'bg-red-500' :
                        'bg-amber-500' // creativity
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar: Profile & Achievements */}
        <div className="space-y-6">
          {/* Level & XP Progress */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Level {user.level}</h3>
                <span className="text-xs text-gray-500">
                  {userProgress.experiencePoints} / {userProgress.nextLevelThreshold} XP
                </span>
              </div>
              <div className="mt-2">
                <ProgressBar
                  value={userProgress.experiencePoints - getLevelRequirement(user.level)}
                  max={userProgress.nextLevelThreshold - getLevelRequirement(user.level)}
                  showLabel={false}
                  color="primary"
                />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {Math.round(userProgress.percentToNextLevel)}% to Level {user.level + 1}
            </div>
          </div>
          
          {/* Achievements/Badges */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="font-bold mb-4">Recent Achievements</h3>
            {user.badges.length > 0 ? (
              <div className="flex flex-wrap gap-3 justify-center">
                {user.badges.slice(0, 4).map((badge) => (
                  <BadgeComponent
                    key={badge.id}
                    badge={badge}
                    size="sm"
                    onClick={() => setSelectedBadge(badge)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center">Complete missions to earn badges.</p>
            )}
            
            {selectedBadge && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{selectedBadge.name}</h4>
                  <button 
                    className="text-xs text-gray-400" 
                    onClick={() => setSelectedBadge(null)}
                  >
                    Close
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{selectedBadge.description}</p>
              </div>
            )}
            
            {user.badges.length > 0 && (
              <div className="mt-4 text-center">
                <button className="text-primary text-sm hover:underline">
                  View all achievements
                </button>
              </div>
            )}
          </div>
          
          {/* Current Mission Status */}
          {user.currentMission && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="font-bold mb-3">Current Mission</h3>
              {missions
                .filter(mission => mission.id === user.currentMission)
                .map(mission => (
                  <div key={mission.id} className="space-y-3">
                    <div>
                      <h4 className="font-medium">{mission.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{mission.description}</p>
                    </div>
                    <button 
                      className="w-full bg-primary text-white py-2 px-4 rounded-md text-sm hover:bg-primary-600 transition-colors"
                      onClick={() => onSelectMission(mission.id)}
                    >
                      Continue Mission
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;