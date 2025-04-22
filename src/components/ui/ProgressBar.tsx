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
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };
  
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-amber-500',
  };
  
  const barColor = colorClasses[color as keyof typeof colorClasses] || 'bg-primary';
  
  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">{label || 'Progress'}</span>
          <span className="text-xs font-medium text-gray-700">{percentage}%</span>
        </div>
      )}
      <div 
        className={cn(
          'w-full overflow-hidden rounded-full bg-gray-200',
          sizeClasses[size]
        )}
      >
        {animate ? (
          <motion.div 
            className={cn('h-full rounded-full', barColor)}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ) : (
          <div 
            className={cn('h-full rounded-full', barColor)}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
};

export { ProgressBar };