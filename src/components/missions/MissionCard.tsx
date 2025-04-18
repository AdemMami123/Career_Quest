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
        return { label: 'Not Started', class: 'is-light' };
      case 'in-progress':
        return { label: 'In Progress', class: 'is-info' };
      case 'completed':
        return { label: 'Completed', class: 'is-success' };
      case 'failed':
        return { label: 'Failed', class: 'is-danger' };
      default:
        return { label: 'Unknown', class: 'is-light' };
    }
  };

  const getDifficultyTag = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'is-success';
      case 'medium':
        return 'is-warning';
      case 'hard':
        return 'is-danger is-light';
      case 'expert':
        return 'is-danger';
      default:
        return 'is-light';
    }
  };

  const statusInfo = getStatusInfo(mission.status);

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
        className={`has-background-${mission.difficulty === 'easy' ? 'success' : 
                                     mission.difficulty === 'medium' ? 'warning' : 
                                     mission.difficulty === 'hard' ? 'danger is-light' : 
                                     'danger'}`}
        style={{ height: '8px', width: '100%' }}
        role="presentation"
        aria-hidden="true"
      />
      <div className="card-content">
        <div className="is-flex is-justify-content-space-between is-align-items-start mb-3">
          <div className="is-flex is-align-items-center">
            <span className={`tag ${statusInfo.class} mr-1`}>
              {statusInfo.label}
            </span>
            <span className="tag is-primary is-light">
              {mission.points} XP
            </span>
          </div>
          {mission.timeLimit && (
            <div className="is-flex is-align-items-center">
              <Clock size={14} className="mr-1" />
              <span className="is-size-7 has-text-grey">{Math.floor(mission.timeLimit / 60)} min</span>
            </div>
          )}
        </div>
        
        <h3 className="title is-5 mb-2">{mission.title}</h3>
        
        <div className="is-flex is-align-items-center mb-3">
          <div className="is-flex is-align-items-center mr-2">
            {getCategoryIconComponent(mission.category)}
            <span className="ml-1 is-capitalized is-size-7">{mission.category}</span>
          </div>
          <span className={`tag ${getDifficultyTag(mission.difficulty)} is-capitalized`}>
            {mission.difficulty}
          </span>
        </div>
        
        <p className="is-size-7 has-text-grey mb-4" style={{
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden'
        }}>
          {mission.description}
        </p>
        
        {mission.badgeReward && (
          <div className="is-size-7 has-text-grey mb-3 is-flex is-align-items-center">
            <span className="mr-2">Reward:</span>
            <span className="has-text-weight-medium has-text-primary">{mission.badgeReward.name} Badge</span>
          </div>
        )}
        
        <div className="is-flex is-align-items-center is-justify-content-space-between pt-2 mt-2" style={{ borderTop: '1px solid #f0f0f0' }}>
          <div className="is-size-7 has-text-grey">
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