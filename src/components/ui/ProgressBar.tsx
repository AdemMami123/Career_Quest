import React from 'react';
import { motion } from 'framer-motion';
import * as Progress from '@radix-ui/react-progress';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | string;
  label?: string;
  className?: string;
  animate?: boolean;
}

const ProgressBar = ({
  value,
  max,
  showLabel = false,
  size = 'md',
  color = 'primary',
  label,
  className,
  animate = true,
}: ProgressBarProps) => {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  
  const sizeClasses = {
    sm: 'is-small',
    md: '',
    lg: 'is-medium',
  };
  
  const colorClasses = {
    primary: 'is-primary',
    secondary: 'is-info',
    accent: 'is-warning',
  };
  
  const colorClass = colorClasses[color as keyof typeof colorClasses] || 'is-primary';
  
  return (
    <div className={cn('', className)}>
      {(showLabel || label) && (
        <div className="is-flex is-justify-content-space-between mb-1">
          <span className="is-size-7">{label || 'Progress'}</span>
          <span className="is-size-7">{percentage}%</span>
        </div>
      )}
      <div className={`progress ${colorClass} ${sizeClasses[size]}`} value={percentage} max="100">
        {animate ? (
          <motion.div 
            className="progress-bar"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ height: '100%', backgroundColor: 'currentColor' }}
          />
        ) : (
          <div 
            className="progress-bar" 
            style={{ width: `${percentage}%`, height: '100%', backgroundColor: 'currentColor' }} 
          />
        )}
      </div>
    </div>
  );
};

export { ProgressBar };