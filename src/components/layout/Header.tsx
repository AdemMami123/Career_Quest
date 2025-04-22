import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { getLevelRequirement } from '../../lib/mock-data';
import { Bell, Menu, X } from 'lucide-react';

interface HeaderProps {
  user?: User;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  onToggleSidebar,
  isSidebarOpen
}) => {
  const [notifications] = useState<{ id: string; message: string }[]>([
    { id: 'notif1', message: 'New mission available: Customer Service Simulation' },
    { id: 'notif2', message: 'Team Captain badge earned!' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Calculate XP progress to next level
  const currentLevelXp = user ? getLevelRequirement(user.level) : 0;
  const nextLevelXp = user ? getLevelRequirement(user.level + 1) : 100;
  const xpForCurrentLevel = user ? user.experience - currentLevelXp : 0;
  const xpRequiredForNextLevel = nextLevelXp - currentLevelXp;
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <motion.div
              className="ml-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-bold text-xl text-primary">Career Quest</span>
            </motion.div>
          </div>
          
          {user && (
            <div className="flex items-center">
              {/* Level and XP */}
              <div className="hidden md:flex flex-col items-end mr-4">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">Level {user.level}</span>
                  <span className="tag bg-primary-100 text-primary-700">
                    {xpForCurrentLevel} / {xpRequiredForNextLevel} XP
                  </span>
                </div>
                <div className="w-40 mt-1">
                  <ProgressBar 
                    value={xpForCurrentLevel} 
                    max={xpRequiredForNextLevel} 
                    size="sm"
                    color="primary" 
                  />
                </div>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-red-500"></span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
                    <div className="p-3 border-b">
                      <p className="font-medium">Notifications</p>
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div className="p-4">
                        <span className="text-gray-500">No new notifications</span>
                      </div>
                    ) : (
                      <div>
                        {notifications.map((notification) => (
                          <a
                            key={notification.id}
                            href="#"
                            className="block px-4 py-3 hover:bg-gray-50 border-b"
                          >
                            {notification.message}
                          </a>
                        ))}
                      </div>
                    )}
                    
                    <div className="p-3 text-center">
                      <a href="#" className="text-xs font-medium text-gray-500">View all notifications</a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Avatar */}
              <div className="ml-4 flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-xs font-medium">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.role === 'candidate' ? 'Candidate' : 'HR Manager'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;