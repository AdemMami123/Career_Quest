import React from 'react';
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';

/**
 * This component is used to diagnose if styles are being applied correctly.
 * Add this to any component temporarily to check styling.
 */
export const StyleTest: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 z-50 p-5 bg-white shadow-lg rounded-lg max-w-xs">
      <h3 className="text-primary text-lg font-bold mb-3">Tailwind CSS 3.3.3</h3>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Colors</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-primary text-white rounded-md">Primary</div>
          <div className="p-2 bg-secondary text-white rounded-md">Secondary</div>
          <div className="p-2 bg-accent text-white rounded-md">Accent</div>
          <div className="p-2 bg-gray-100 text-gray-800 rounded-md">Gray</div>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Buttons</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="default" size="sm">Primary</Button>
          <Button variant="secondary" size="sm">Secondary</Button>
          <Button variant="outline" size="sm">Outline</Button>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Badges</h4>
        <div className="flex flex-wrap gap-2">
          <span className="badge bg-primary-100 text-primary-800">Primary</span>
          <span className="badge bg-green-100 text-green-800">Success</span>
          <span className="badge bg-amber-100 text-amber-800">Warning</span>
        </div>
      </div>
      
      <div className="mb-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Progress</h4>
        <ProgressBar value={65} max={100} showLabel label="Progress" />
      </div>
    </div>
  );
};
