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
      className="bg-white"
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        bottom: '0',
        width: isOpen ? '240px' : '80px',
        boxShadow: '1px 0 3px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        marginTop: '4rem' // Header height
      }}
      animate={{ width: isOpen ? 240 : 80 }}
      initial={false}
    >
      <div className="flex-grow overflow-auto py-4">
        <div className="text-center mb-4">
          {isOpen ? (
            <motion.h1
              className="font-bold text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Career Quest
            </motion.h1>
          ) : (
            <motion.div
              className="bg-primary text-white font-bold flex items-center justify-center mx-auto"
              style={{ width: '40px', height: '40px', borderRadius: '6px' }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              CQ
            </motion.div>
          )}
        </div>
        
        <ul className="px-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            const IconComponent = item.icon;
            
            return (
              <li key={item.name} className="mb-1">
                <a
                  onClick={() => onNavigate(item.path)}
                  className={`flex items-center rounded-md px-3 py-2 transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                  style={{
                    justifyContent: isOpen ? 'flex-start' : 'center',
                    cursor: 'pointer'
                  }}
                >
                  <IconComponent
                    size={20}
                    className={isActive ? 'text-primary' : 'text-gray-500'}
                    style={{ marginRight: isOpen ? '0.75rem' : '0' }}
                  />
                  {isOpen && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm"
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
      
      <div className="border-t p-4">
        <button
          className="w-full flex items-center justify-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          style={{
            justifyContent: isOpen ? 'flex-start' : 'center'
          }}
        >
          <LogOut size={20} className="text-gray-500" style={{ marginRight: isOpen ? '0.75rem' : '0' }} />
          {isOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm"
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