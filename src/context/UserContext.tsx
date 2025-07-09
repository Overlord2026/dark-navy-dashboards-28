
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  name?: string;
  displayName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  title?: string;
  suffix?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfBirth?: Date;
  phone?: string;
  investorType?: string;
  role: 'client' | 'advisor' | 'admin' | 'system_administrator' | 'developer' | 'consultant' | 'accountant' | 'attorney';
  permissions?: string[];
}

interface UserContextType {
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, session, isAuthenticated, login: authLogin, logout: authLogout, userProfile: authUserProfile } = useAuth();

  // Helper function to safely parse date from database
  const parseDateSafely = (dateString: string): Date => {
    if (!dateString) return new Date();
    
    // If it's a date-only string (YYYY-MM-DD), parse it in local timezone
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day, 12, 0, 0, 0);
    }
    
    // For datetime strings, create in local timezone at noon on that date
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
    }
    
    return new Date();
  };

  useEffect(() => {
    // Simply use the profile from AuthContext - no duplicate loading
    if (authUserProfile) {
      setUserProfile(authUserProfile);
      setIsLoading(false);
    } else if (user && session) {
      // AuthContext is still loading the profile
      setIsLoading(true);
    } else {
      // Not authenticated
      setUserProfile(null);
      setIsLoading(false);
    }
  }, [authUserProfile, user, session]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    return await authLogin(email, password);
  };

  const logout = () => {
    authLogout();
    setUserProfile(null);
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (userProfile && user) {
      try {
        console.log("Updating user profile locally:", profile);
        
        // Update local state immediately for better UX
        const updatedProfile = { ...userProfile, ...profile };
        setUserProfile(updatedProfile);
        
        // The database update is handled in the ProfileForm component
        // This function is mainly for local state updates
      } catch (error) {
        console.error('Error in updateUserProfile:', error);
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
