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
        return 'bg-gray-200 text-gray-700';
      case 'uncommon':
        return 'bg-green-500 text-white';
      case 'rare':
        return 'bg-blue-500 text-white';
      case 'epic':
        return 'bg-purple-500 text-white';
      case 'legendary':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
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
      className="flex flex-col items-center"
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
      <div className="relative">
        {/* Badge Icon Container */}
        <div 
          className={`flex items-center justify-center ${rarityClass} rounded-full overflow-hidden relative`}
          style={{ 
            ...sizeClasses[size]
          }}
        >
          {getCategoryIconComponent(badge.category)}
        </div>
        
        {/* "New" indicator */}
        {isNew && (
          <motion.div 
            className="bg-red-500 text-white flex items-center justify-center text-xs absolute -top-1 -right-1 w-5 h-5 rounded-full"
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
            className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%] animate-badge-shine"
          />
        )}
      </div>
      
      {showDetails && (
        <motion.div 
          className="text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="font-medium text-sm">{badge.name}</h4>
          {size === 'lg' && (
            <p className="text-xs text-gray-500 mt-1 max-w-[200px]">{badge.description}</p>
          )}
          <span className={`tag mt-1 capitalize ${
            badge.rarity === 'common' ? 'bg-gray-100 text-gray-700' : 
            badge.rarity === 'uncommon' ? 'bg-green-100 text-green-800' : 
            badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' : 
            badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' : 
            'bg-amber-100 text-amber-800'}`}
          >
            {badge.rarity}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BadgeComponent;