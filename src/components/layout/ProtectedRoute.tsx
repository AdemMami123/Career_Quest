import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectPath = '/login',
}) => {
  const { user, isLoading, userRole } = useAuth();

  // Show loading indicator while authentication state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  // Redirect to appropriate dashboard if user doesn't have required role
  if (!allowedRoles.includes(userRole as UserRole)) {
    // Redirect HR to HR dashboard
    if (userRole === 'hr') {
      return <Navigate to="/hr-dashboard" replace />;
    }
    
    // Redirect candidates to candidate dashboard
    if (userRole === 'candidate') {
      return <Navigate to="/candidate-dashboard" replace />;
    }
    
    // Default redirect if role is unknown
    return <Navigate to={redirectPath} replace />;
  }

  // User has correct role, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;