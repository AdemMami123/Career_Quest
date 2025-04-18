import React from 'react';
import { motion } from 'framer-motion';
import { User } from '../../types';
import { 
  Home, 
  Trophy, 
  Briefcase, 
  BarChart, 
  Settings,
  Users,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  user?: User;
  onNavigate: (path: string) => void;
  currentPath: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen,
  user,
  onNavigate,
  currentPath
}) => {
  // Different navigation items based on user role
  const candidateNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Missions', path: '/missions', icon: Briefcase },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
    { name: 'Profile', path: '/profile', icon: Settings }
  ];
  
  const hrNavItems = [
    { name: 'Dashboard', path: '/hr-dashboard', icon: Home },
    { name: 'Candidates', path: '/candidates', icon: Users },
    { name: 'Create Missions', path: '/create-missions', icon: Briefcase },
    { name: 'Analytics', path: '/analytics', icon: BarChart },
    { name: 'Settings', path: '/settings', icon: Settings }
  ];
  
  const navItems = user?.role === 'hr' ? hrNavItems : candidateNavItems;
  
  return (
    <motion.aside 
      className="menu has-background-white"
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        bottom: '0',
        width: isOpen ? '240px' : '80px',
        boxShadow: '1px 0 3px rgba(0,0,0,0.1)',
        paddingTop: '1rem',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        marginTop: '3.25rem' // Navbar height
      }}
      animate={{ width: isOpen ? 240 : 80 }}
      initial={false}
    >
      <div style={{ flexGrow: 1, overflow: 'auto', padding: '1rem 0' }}>
        <div className="has-text-centered mb-4">
          {isOpen ? (
            <motion.h1
              className="has-text-weight-bold has-text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Career Quest
            </motion.h1>
          ) : (
            <motion.div
              className="has-background-primary has-text-white has-text-weight-bold is-flex is-align-items-center is-justify-content-center"
              style={{ width: '40px', height: '40px', borderRadius: '6px', margin: '0 auto' }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              CQ
            </motion.div>
          )}
        </div>
        
        <ul className="menu-list">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const IconComponent = item.icon;
            
            return (
              <li key={item.name}>
                <a
                  onClick={() => onNavigate(item.path)}
                  className={isActive ? 'is-active' : ''}
                  style={{ 
                    padding: isOpen ? '0.5rem 0.75rem' : '0.5rem', 
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    transition: 'background-color 0.3s'
                  }}
                >
                  <IconComponent
                    size={20}
                    className={isActive ? 'has-text-primary' : 'has-text-grey'}
                    style={{ marginRight: isOpen ? '0.75rem' : '0' }}
                  />
                  {isOpen && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="has-border-top pt-4 pb-4 px-2">
        <button
          className="button is-white is-fullwidth is-flex is-align-items-center is-justify-content-center"
          style={{
            justifyContent: isOpen ? 'flex-start' : 'center'
          }}
        >
          <LogOut size={20} className="has-text-grey mr-2" />
          {isOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Log out
            </motion.span>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;