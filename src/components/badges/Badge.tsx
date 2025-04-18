import React from 'react';
import { motion } from 'framer-motion';
import { Badge as BadgeType } from '../../types';
import { getCategoryIcon } from '../../lib/utils';
import { Star, Code, Users, MessageSquare, Brain, Lightbulb } from 'lucide-react';

interface BadgeProps {
  badge: BadgeType;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  isNew?: boolean;
  onClick?: (badge: BadgeType) => void;
}

const BadgeComponent: React.FC<BadgeProps> = ({
  badge,
  size = 'md',
  showDetails = false,
  isNew = false,
  onClick,
}) => {
  // Get rarity color class based on badge rarity
  const getRarityColorClass = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common':
        return 'has-background-light';
      case 'uncommon':
        return 'has-background-success';
      case 'rare':
        return 'has-background-info';
      case 'epic':
        return 'has-background-purple';
      case 'legendary':
        return 'has-background-warning';
      default:
        return 'has-background-light';
    }
  };
  
  // Map category to the correct icon
  const getCategoryIconComponent = (category: string) => {
    switch (getCategoryIcon(category)) {
      case 'brain':
        return <Brain size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />;
      case 'users':
        return <Users size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />;
      case 'message-square':
        return <MessageSquare size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />;
      case 'code':
        return <Code size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />;
      case 'lightbulb':
        return <Lightbulb size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />;
      default:
        return <Star size={size === 'sm' ? 14 : size === 'md' ? 18 : 24} />;
    }
  };

  const sizeClasses = {
    sm: { width: '48px', height: '48px' },
    md: { width: '64px', height: '64px' },
    lg: { width: '96px', height: '96px' },
  };

  const handleClick = () => {
    if (onClick) {
      onClick(badge);
    }
  };

  const rarityClass = getRarityColorClass(badge.rarity);

  return (
    <motion.div
      className="is-flex is-flex-direction-column is-align-items-center"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      onClick={handleClick}
      whileHover={onClick ? { scale: 1.05 } : {}}
      initial={isNew ? { scale: 0 } : { scale: 1 }}
      animate={{ scale: 1 }}
      transition={isNew ? { 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.2
      } : {}}
    >
      <div className="is-relative">
        {/* Badge Icon Container */}
        <div 
          className={`is-flex is-align-items-center is-justify-content-center ${rarityClass} has-text-white`}
          style={{ 
            ...sizeClasses[size], 
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {getCategoryIconComponent(badge.category)}
        </div>
        
        {/* "New" indicator */}
        {isNew && (
          <motion.div 
            className="has-background-danger has-text-white is-flex is-align-items-center is-justify-content-center"
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              fontSize: '0.75rem'
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            !
          </motion.div>
        )}
        
        {/* Legendary shine effect */}
        {badge.rarity === 'legendary' && (
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: 'badgeShine 2s linear infinite'
            }}
          />
        )}
      </div>
      
      {showDetails && (
        <motion.div 
          className="has-text-centered mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="has-text-weight-medium is-size-6">{badge.name}</h4>
          {size === 'lg' && (
            <p className="is-size-7 has-text-grey mt-1" style={{ maxWidth: '200px' }}>{badge.description}</p>
          )}
          <span className={`tag is-rounded mt-1 is-capitalized 
            ${badge.rarity === 'common' ? 'is-light' : 
              badge.rarity === 'uncommon' ? 'is-success is-light' : 
              badge.rarity === 'rare' ? 'is-info is-light' : 
              badge.rarity === 'epic' ? 'is-purple is-light' : 
              'is-warning is-light'}`}
          >
            {badge.rarity}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BadgeComponent;