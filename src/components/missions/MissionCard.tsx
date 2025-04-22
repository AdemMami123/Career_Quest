import React from 'react';
import { motion } from 'framer-motion';
import { Mission } from '../../types';
import { Button } from '../ui/Button';
import { getDifficultyColor, getCategoryIcon } from '../../lib/utils';
import { Code, Users, MessageSquare, Brain, Lightbulb, Star, Clock } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  onSelect: (missionId: string) => void;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onSelect }) => {  
  // Map category to the correct icon
  const getCategoryIconComponent = (category: string) => {
    switch (getCategoryIcon(category)) {
      case 'brain':
        return <Brain size={16} />;
      case 'users':
        return <Users size={16} />;
      case 'message-square':
        return <MessageSquare size={16} />;
      case 'code':
        return <Code size={16} />;
      case 'lightbulb':
        return <Lightbulb size={16} />;
      default:
        return <Star size={16} />;
    }
  };

  // Status label and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'not-started':
        return { label: 'Not Started', class: 'bg-gray-100 text-gray-700' };
      case 'in-progress':
        return { label: 'In Progress', class: 'bg-blue-100 text-blue-700' };
      case 'completed':
        return { label: 'Completed', class: 'bg-green-100 text-green-700' };
      case 'failed':
        return { label: 'Failed', class: 'bg-red-100 text-red-700' };
      default:
        return { label: 'Unknown', class: 'bg-gray-100 text-gray-700' };
    }
  };

  const getDifficultyTag = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'hard':
        return 'bg-orange-100 text-orange-700';
      case 'expert':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get difficulty color for the top border
  const getDifficultyBorderColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-amber-500';
      case 'hard':
        return 'bg-orange-500';
      case 'expert':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const statusInfo = getStatusInfo(mission.status);
  const difficultyBorder = getDifficultyBorderColor(mission.difficulty);

  return (
    <motion.div 
      className="card"
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className={`${difficultyBorder} w-full h-2`}
        role="presentation"
        aria-hidden="true"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <span className={`tag ${statusInfo.class} mr-1`}>
              {statusInfo.label}
            </span>
            <span className="tag bg-primary-100 text-primary-700">
              {mission.points} XP
            </span>
          </div>
          {mission.timeLimit && (
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span className="text-xs text-gray-500">{Math.floor(mission.timeLimit / 60)} min</span>
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-bold mb-2">{mission.title}</h3>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            <span className="mr-1">{getCategoryIconComponent(mission.category)}</span>
            <span className="text-xs capitalize">{mission.category}</span>
          </div>
          <span className={`tag ${getDifficultyTag(mission.difficulty)} capitalize`}>
            {mission.difficulty}
          </span>
        </div>
        
        <p className="text-xs text-gray-500 mb-4 line-clamp-2">
          {mission.description}
        </p>
        
        {mission.badgeReward && (
          <div className="text-xs text-gray-500 mb-3 flex items-center">
            <span className="mr-2">Reward:</span>
            <span className="font-medium text-primary">{mission.badgeReward.name} Badge</span>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            {mission.tasks.length} tasks
          </div>
          <Button
            size="sm"
            onClick={() => onSelect(mission.id)}
          >
            Start Mission
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MissionCard;