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
    <header className="navbar is-white has-shadow">
      <div className="container">
        <div className="navbar-brand">
          <div className="navbar-item">
            <button
              onClick={onToggleSidebar}
              className="button is-white"
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
            
          <motion.div
            className="navbar-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="has-text-weight-bold is-size-4 has-text-primary">Career Quest</span>
          </motion.div>
        </div>
          
        {user && (
          <div className="navbar-end">
            {/* Level and XP */}
            <div className="navbar-item is-hidden-mobile">
              <div className="is-flex is-flex-direction-column is-align-items-flex-end mr-4">
                <div className="is-flex is-align-items-center">
                  <span className="is-size-7 has-text-grey mr-2">Level {user.level}</span>
                  <span className="tag is-primary is-light">
                    {xpForCurrentLevel} / {xpRequiredForNextLevel} XP
                  </span>
                </div>
                <div style={{ width: '160px', marginTop: '4px' }}>
                  <ProgressBar 
                    value={xpForCurrentLevel} 
                    max={xpRequiredForNextLevel} 
                    size="sm"
                    color="primary" 
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="navbar-item has-dropdown is-hoverable">
              <button
                className="button is-white"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="icon">
                  <Bell size={20} />
                </span>
                {notifications.length > 0 && (
                  <span className="tag is-danger is-rounded is-small" style={{ position: 'absolute', top: '0', right: '0' }}>&nbsp;</span>
                )}
              </button>

              {/* Notifications dropdown */}
              <div className="navbar-dropdown is-right">
                <div className="navbar-item">
                  <p className="has-text-weight-medium">Notifications</p>
                </div>
                <hr className="navbar-divider" />
                {notifications.length === 0 ? (
                  <div className="navbar-item">
                    <span className="has-text-grey">No new notifications</span>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <a
                      key={notification.id}
                      href="#"
                      className="navbar-item"
                    >
                      {notification.message}
                    </a>
                  ))
                )}
                <hr className="navbar-divider" />
                <div className="navbar-item">
                  <a href="#" className="is-size-7 has-text-centered has-text-grey has-text-weight-medium">View all notifications</a>
                </div>
              </div>
            </div>
              
            {/* User Avatar */}
            <div className="navbar-item">
              <div className="is-flex is-align-items-center">
                <div className="is-flex-shrink-0">
                  <div className="image is-32x32">
                    <div className="is-rounded has-background-primary is-flex is-align-items-center is-justify-content-center has-text-white" style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
                      {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span className="is-size-6 has-text-weight-medium">{user.name.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="is-size-7 has-text-weight-medium">
                    {user.name}
                  </div>
                  <div className="is-size-7 has-text-grey">
                    {user.role === 'candidate' ? 'Candidate' : 'HR Manager'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;