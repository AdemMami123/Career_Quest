import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import CandidateDashboard from './components/dashboard/CandidateDashboard';
import HRDashboard from './components/dashboard/HRDashboard';
import MissionForm from './components/missions/MissionForm';
import BadgeReward from './components/badges/BadgeReward';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ProtectedRoute from './components/layout/ProtectedRoute';
import SupabaseTest from './components/ui/SupabaseTest';
import { mockUser, mockHrUser, mockMissions, mockUserProgress, mockCandidateAnalytics } from './lib/mock-data';
import { Badge, Mission } from './types';
import { MissionService } from './lib/MissionService';

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
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch missions from Supabase on component mount
  useEffect(() => {
    async function fetchMissions() {
      try {
        setLoading(true);
        const supabaseMissions = await MissionService.getMissions();
        
        // If we have missions in the database, use those
        if (supabaseMissions && supabaseMissions.length > 0) {
          console.log('Loaded missions from Supabase:', supabaseMissions);
          setMissions(supabaseMissions);
        } else {
          // Otherwise use mock missions (for development)
          console.log('No missions found in Supabase, using mock data');
          setMissions(mockMissions);
        }
      } catch (error) {
        console.error('Error fetching missions from Supabase:', error);
        // Fallback to mock data if there's an error
        setMissions(mockMissions);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMissions();
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleSelectMission = (missionId: string) => {
    // In a real app, this would navigate to the mission details/gameplay screen
    console.log(`Selected mission: ${missionId}`);
    
    // For demo purposes, show a badge reward when selecting a mission
    const mission = missions.find(m => m.id === missionId);
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
    setEditingMission(null);
    setShowMissionForm(true);
  };
  
  const handleEditMission = (mission: Mission) => {
    setEditingMission(mission);
    setShowMissionForm(true);
  };

  const handleMissionFormSubmit = async (missionData: Partial<Mission>) => {
    try {
      console.log('Submitting mission data:', missionData);
      
      if (editingMission) {
        // Update existing mission
        console.log(`Updating existing mission with ID: ${editingMission.id}`);
        const updatedMission = await MissionService.updateMission(
          editingMission.id,
          missionData
        );
        
        if (updatedMission) {
          console.log('Mission updated successfully:', updatedMission);
          setMissions(prevMissions => 
            prevMissions.map(m => 
              m.id === updatedMission.id ? updatedMission : m
            )
          );
          // Close the form
          setShowMissionForm(false);
          setEditingMission(null);
        } else {
          console.error('Failed to update mission: No data returned from update operation');
          // Handle error case - in a real app, you would show a user-friendly error
          alert('Failed to update mission. Please try again.');
        }
      } else {
        // Create new mission
        console.log('Creating new mission with data:', {
          ...missionData,
          tasks: missionData.tasks || [], // Ensure tasks exist
          created_by: 'current-user' // In a real app, this would be the logged in user's ID
        });
        
        // Properly type the mission data for creation
        const missionDataForCreation = {
          ...missionData,
          created_by: 'current-user' // In a real app, this would be the logged in user's ID
        } as Omit<Mission, 'id' | 'status'>;
        
        const newMission = await MissionService.createMission(missionDataForCreation);
        
        console.log('Mission created successfully:', newMission);
        setMissions(prevMissions => [...prevMissions, newMission]);
        
        // Close the form
        setShowMissionForm(false);
        setEditingMission(null);
      }
    } catch (error) {
      console.error('Error saving mission:', error);
      // Show an error message to the user
      alert(`Error saving mission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const handleDeleteMission = async (missionId: string) => {
    try {
      const success = await MissionService.deleteMission(missionId);
      
      if (success) {
        setMissions(prevMissions => 
          prevMissions.filter(mission => mission.id !== missionId)
        );
      }
    } catch (error) {
      console.error('Error deleting mission:', error);
      // In a real app, you would show an error message to the user
    }
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
  
  // Mission form modal
  const missionFormModal = (
    <AnimatePresence>
      {showMissionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <MissionForm
            initialMission={editingMission || undefined}
            onSubmit={handleMissionFormSubmit}
            onCancel={() => {
              setShowMissionForm(false);
              setEditingMission(null);
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Supabase Test Route */}
          <Route path="/test-supabase" element={
            <Layout 
              currentPath={location.pathname}
              onNavigate={handleNavigate}
            >
              <SupabaseTest />
            </Layout>
          } />

          {/* Protected route for HR users only */}
          <Route 
            path="/hr-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['hr']}>
                <Layout 
                  currentPath={location.pathname}
                  onNavigate={handleNavigate}
                >
                  <HRDashboard
                    user={mockHrUser}
                    candidateAnalytics={mockCandidateAnalytics}
                    missions={missions}
                    onViewCandidate={handleViewCandidate}
                    onCreateMission={handleCreateMission}
                    onEditMission={handleEditMission}
                    onDeleteMission={handleDeleteMission}
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
                <Layout 
                  currentPath={location.pathname}
                  onNavigate={handleNavigate}
                >
                  <CandidateDashboard
                    user={mockUser}
                    missions={missions}
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
      )}
      
      {badgeRewardModal}
      {missionFormModal}
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
