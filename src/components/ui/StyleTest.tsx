import React from 'react';

/**
 * This component is used to diagnose if styles are being applied correctly.
 * Add this to any component temporarily to check styling.
 */
export const StyleTest: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 z-50 p-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-primary text-lg font-bold mb-2">Style Test Component</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-primary text-white rounded">Primary</div>
        <div className="p-2 bg-secondary text-white rounded">Secondary</div>
        <div className="p-2 bg-gray-100 text-gray-800 rounded">Gray</div>
        <div className="p-2 bg-red-500 text-white rounded">Red</div>
      </div>
      <div className="mt-2">
        <button className="btn-primary mr-2">Button</button>
        <span className="badge bg-green-100 text-green-800">Badge</span>
      </div>
    </div>
  );
};
