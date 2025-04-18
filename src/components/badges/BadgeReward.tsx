import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../../types';
import BadgeComponent from './Badge';
import { Button } from '../ui/Button';

interface BadgeRewardProps {
  badge: Badge;
  onClose: () => void;
}

const BadgeReward: React.FC<BadgeRewardProps> = ({ badge, onClose }) => {
  const [animationStage, setAnimationStage] = useState(0);
  
  useEffect(() => {
    // Auto-progress animation stages
    const timer = setTimeout(() => {
      if (animationStage < 2) {
        setAnimationStage(animationStage + 1);
      }
    }, animationStage === 0 ? 1000 : 2000);
    
    return () => clearTimeout(timer);
  }, [animationStage]);

  const confettiColors = ['#FFD700', '#FF8C00', '#FF1493', '#4169E1', '#32CD32'];
  
  // Create confetti pieces for animation
  const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
    const randomColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const left = `${Math.random() * 100}%`;
    const animDelay = Math.random() * 0.5;
    const size = Math.random() * 10 + 5;
    
    return (
      <motion.div
        key={i}
        className="is-rounded"
        style={{
          left,
          top: '-20px',
          width: size,
          height: size,
          backgroundColor: randomColor,
          position: 'absolute',
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: [`${Math.random() * 20}vh`, `${80 + Math.random() * 20}vh`],
          opacity: [0, 1, 1, 0],
          rotate: [0, Math.random() * 360],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          ease: "easeOut",
          delay: animDelay,
        }}
      />
    );
  });

  return (
    <div className="is-fixed-cover is-flex is-justify-content-center is-align-items-center has-background-dark-alpha-50" 
         style={{position: 'fixed', inset: 0, backdropFilter: 'blur(4px)', zIndex: 50}}>
      <motion.div 
        className="box has-background-white"
        style={{maxWidth: '480px', width: '100%', margin: '0 1rem', overflow: 'hidden'}}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Confetti animation */}
        {animationStage >= 1 && confettiPieces}
        
        <div className="has-text-centered">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <h2 className="title is-4 has-text-primary">Badge Earned!</h2>
            <p className="has-text-grey mt-2">You've unlocked a new achievement</p>
          </motion.div>

          <div className="py-4 is-flex is-justify-content-center">
            <BadgeComponent badge={badge} size="lg" showDetails isNew />
          </div>

          <AnimatePresence>
            {animationStage >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4"
              >
                <div className="is-size-7 has-text-grey mb-5 mx-auto" style={{maxWidth: '280px'}}>
                  <p>This badge has been added to your collection. Keep up the good work!</p>
                </div>
                
                <Button onClick={onClose}>
                  Continue
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default BadgeReward;