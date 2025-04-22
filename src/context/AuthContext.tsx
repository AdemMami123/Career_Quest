import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

// Define user data type for signup
type UserData = {
  full_name?: string;
  role?: string;
  [key: string]: unknown;
};

// Define the role type for type safety
export type UserRole = 'candidate' | 'hr';

// Define the context types
type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | null;
    data: { session: Session | null; user: User | null } | null;
  }>;
  signUp: (email: string, password: string, userData?: UserData) => Promise<{
    error: AuthError | null;
    data: { session: Session | null; user: User | null } | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  getUserRole: () => UserRole | null;
  navigateByRole: () => void;
  isHR: () => boolean;
  isCandidate: () => boolean;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
  userRole: null,
  signIn: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  getUserRole: () => null,
  navigateByRole: () => {},
  isHR: () => false,
  isCandidate: () => false,
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to extract and set the user role from user metadata
  const extractUserRole = (user: User | null): UserRole | null => {
    if (!user || !user.user_metadata || !user.user_metadata.role) {
      return null;
    }
    
    const role = user.user_metadata.role as UserRole;
    return role === 'hr' || role === 'candidate' ? role : null;
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (session) {
          setSession(session);
          setUser(session.user);
          const role = extractUserRole(session.user);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        const role = extractUserRole(currentUser);
        setUserRole(role);
        setIsLoading(false);
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({ email, password });
    
    // Update user role after successful sign in
    if (response.data.user) {
      const role = extractUserRole(response.data.user);
      setUserRole(role);
    }
    
    return response;
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: UserData) => {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return response;
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
  };

  // Get the user's role
  const getUserRole = (): UserRole | null => {
    return userRole;
  };

  // Check if user is HR
  const isHR = (): boolean => {
    return userRole === 'hr';
  };

  // Check if user is a candidate
  const isCandidate = (): boolean => {
    return userRole === 'candidate';
  };

  // Navigate based on user role
  const navigateByRole = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (userRole === 'hr') {
      navigate('/hr-dashboard');
    } else if (userRole === 'candidate') {
      navigate('/candidate-dashboard');
    } else {
      // Default dashboard or error page
      navigate('/');
    }
  };

  const value = {
    session,
    user,
    isLoading,
    userRole,
    signIn,
    signUp,
    signOut,
    resetPassword,
    getUserRole,
    navigateByRole,
    isHR,
    isCandidate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};