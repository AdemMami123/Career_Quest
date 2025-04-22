import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import CandidateDashboard from './components/dashboard/CandidateDashboard';
import HRDashboard from './components/dashboard/HRDashboard';
import BadgeReward from './components/badges/BadgeReward';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { mockUser, mockHrUser, mockMissions, mockUserProgress, mockCandidateAnalytics } from './lib/mock-data';
import { Badge } from './types';

// Main App wrapper with AuthProvider
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

// App routes with proper protected routes
function AppRoutes() {
  const [showBadgeReward, setShowBadgeReward] = useState<Badge | null>(null);
  
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

  // Badge reward modal that can be shown from any route
  const badgeRewardModal = (
    <AnimatePresence>
      {showBadgeReward && (
        <BadgeReward
          badge={showBadgeReward}
          onClose={handleCloseBadgeReward}
        />
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected route for HR users only */}
        <Route 
          path="/hr-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['hr']}>
              <Layout>
                <HRDashboard
                  user={mockHrUser}
                  candidateAnalytics={mockCandidateAnalytics}
                  missions={mockMissions}
                  onViewCandidate={handleViewCandidate}
                  onCreateMission={handleCreateMission}
                />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Protected route for candidate users only */}
        <Route 
          path="/candidate-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <Layout>
                <CandidateDashboard
                  user={mockUser}
                  missions={mockMissions}
                  userProgress={mockUserProgress}
                  onSelectMission={handleSelectMission}
                />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {/* Default route - redirect based on role or to login */}
        <Route 
          path="*" 
          element={<DefaultRedirect />} 
        />
      </Routes>
      
      {badgeRewardModal}
    </>
  );
}

// Component to handle default route redirects based on user role
const DefaultRedirect = () => {
  const { user, userRole } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'hr') {
    return <Navigate to="/hr-dashboard" replace />;
  }

  if (userRole === 'candidate') {
    return <Navigate to="/candidate-dashboard" replace />;
  }

  // Fallback to login if no role is defined
  return <Navigate to="/login" replace />;
};

export default App;
