import React, { useState } from 'react';
import { User } from '../../types';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  user?: User;
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  user, 
  currentPath,
  onNavigate,
  children 
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header 
        user={user} 
        onToggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen} 
      />
      
      <div className="flex overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          user={user} 
          onNavigate={onNavigate} 
          currentPath={currentPath} 
        />
        
        <main 
          className="p-6"
          style={{
            transition: 'margin-left 0.3s ease-in-out',
            marginLeft: isSidebarOpen ? '240px' : '80px',
            flexGrow: 1,
            overflow: 'auto'
          }}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;