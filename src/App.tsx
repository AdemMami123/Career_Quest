import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import CandidateDashboard from './components/dashboard/CandidateDashboard';
import HRDashboard from './components/dashboard/HRDashboard';
import BadgeReward from './components/badges/BadgeReward';
import { mockUser, mockHrUser, mockMissions, mockUserProgress, mockCandidateAnalytics } from './lib/mock-data';
import { Badge } from './types';

function App() {
  const [currentPath, setCurrentPath] = useState('/dashboard');
  const [currentUser, setCurrentUser] = useState(mockUser);
  const [showBadgeReward, setShowBadgeReward] = useState<Badge | null>(null);
  
  // Toggle between candidate and HR user for demo purposes
  const toggleUserRole = () => {
    setCurrentUser(currentUser.role === 'candidate' ? mockHrUser : mockUser);
    setCurrentPath(currentUser.role === 'candidate' ? '/hr-dashboard' : '/dashboard');
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleSelectMission = (missionId: string) => {
    // In a real app, this would navigate to the mission details/gameplay screen
    console.log(`Selected mission: ${missionId}`);
    
    // For demo purposes, show a badge reward when selecting a mission
    const mission = mockMissions.find(m => m.id === missionId);
    if (mission?.badgeReward) {
      setShowBadgeReward(mission.badgeReward);
    }
  };

  const handleCloseBadgeReward = () => {
    setShowBadgeReward(null);
  };

  const handleViewCandidate = (candidateId: string) => {
    // In a real app, this would navigate to the candidate details screen
    console.log(`Viewing candidate: ${candidateId}`);
  };

  const handleCreateMission = () => {
    // In a real app, this would navigate to the mission creation screen
    console.log('Creating new mission');
  };

  // Render different content based on the current path and user role
  const renderContent = () => {
    if (currentUser.role === 'hr') {
      return (
        <HRDashboard
          user={currentUser}
          candidateAnalytics={mockCandidateAnalytics}
          missions={mockMissions}
          onViewCandidate={handleViewCandidate}
          onCreateMission={handleCreateMission}
        />
      );
    }
    
    return (
      <CandidateDashboard
        user={currentUser}
        missions={mockMissions}
        userProgress={mockUserProgress}
        onSelectMission={handleSelectMission}
      />
    );
  };

  return (
    <>
      <Layout
        user={currentUser}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      >
        {renderContent()}
        
        {/* Demo controls - would not be in a real app */}
        <div className="fixed bottom-4 right-4">
          <button
            onClick={toggleUserRole}
            className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm shadow-lg"
          >
            Switch to {currentUser.role === 'candidate' ? 'HR' : 'Candidate'} View
          </button>
        </div>
      </Layout>
      
      {/* Badge reward modal */}
      <AnimatePresence>
        {showBadgeReward && (
          <BadgeReward
            badge={showBadgeReward}
            onClose={handleCloseBadgeReward}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
