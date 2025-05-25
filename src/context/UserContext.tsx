
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

// Define the UserProfile interface
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string;
  displayName: string;
  role: string;
  avatar: string;
  title: string;
  suffix: string;
  gender: string;
  maritalStatus: string;
  dateOfBirth: Date | null;
  phone: string;
  investorType: string;
  createdAt: string;
  permissions: string[];
}

// Define the context type
interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  logout: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  loadUserData: () => Promise<void>;
}

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  userProfile: null,
  setUserProfile: () => {},
  isLoading: true,
  error: null,
  isAuthenticated: false,
  logout: () => {},
  updateUserProfile: async () => false,
  loadUserData: async () => {},
});

// Create a provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isLoading: supabaseLoading, signOut, isAuthenticated } = useSupabaseAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Load user data based on Supabase auth state
  const loadUserData = async () => {
    if (!user) {
      setUserProfile(null);
      setProfileLoaded(true);
      return;
    }

    try {
      // If we have a user but no profile yet, try to create a basic profile from user data
      const profileData = profile || {
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        display_name: user.user_metadata?.display_name || '',
        role: 'client'
      };

      const formattedProfile = formatUserProfile(profileData);
      setUserProfile(formattedProfile);
      setError(null);
    } catch (err) {
      console.error("Error formatting profile:", err);
      setError("Failed to load user profile");
      
      // Even if profile formatting fails, create a minimal profile so user isn't stuck
      if (user) {
        setUserProfile({
          id: user.id,
          name: user.email?.split('@')[0] || 'User',
          email: user.email || '',
          firstName: '',
          lastName: '',
          middleName: '',
          displayName: user.email?.split('@')[0] || 'User',
          role: 'client',
          avatar: '',
          title: '',
          suffix: '',
          gender: '',
          maritalStatus: '',
          dateOfBirth: null,
          phone: '',
          investorType: '',
          createdAt: user.created_at || new Date().toISOString(),
          permissions: [],
        });
      }
    } finally {
      setProfileLoaded(true);
    }
  };

  // Implement logout function
  const logout = async () => {
    try {
      await signOut();
      setUserProfile(null);
      setProfileLoaded(false);
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Failed to log out");
    }
  };

  // Implement updateUserProfile function
  const updateUserProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    if (!userProfile?.id) {
      setError("User not authenticated");
      return false;
    }
    
    try {
      // Update local state with new data
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      return true;
    } catch (err) {
      console.error("Unexpected error updating profile:", err);
      setError("An unexpected error occurred while updating profile");
      return false;
    }
  };

  // Sync with Supabase auth state
  useEffect(() => {
    setProfileLoaded(false);
    loadUserData();
  }, [user, profile]);

  const formatUserProfile = (userData: any): UserProfile => {
    if (!userData) return null;
    
    return {
      id: userData.id,
      name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.display_name || userData.email?.split('@')[0] || 'User',
      email: userData.email || '',
      firstName: userData.first_name || '',
      lastName: userData.last_name || '',
      middleName: userData.middle_name || '',
      displayName: userData.display_name || '',
      role: userData.role || 'client',
      avatar: userData.avatar_url || '',
      title: userData.title || '',
      suffix: userData.suffix || '',
      gender: userData.gender || '',
      maritalStatus: userData.marital_status || '',
      dateOfBirth: userData.date_of_birth ? new Date(userData.date_of_birth) : null,
      phone: userData.phone || '',
      investorType: userData.investor_type || '',
      createdAt: userData.created_at || new Date().toISOString(),
      permissions: userData.permissions || [],
    };
  };

  // The overall loading state should only be true if Supabase is loading or we haven't tried to load the profile yet
  const isLoading = supabaseLoading || (!profileLoaded && isAuthenticated);

  return (
    <UserContext.Provider 
      value={{ 
        userProfile, 
        setUserProfile, 
        isLoading,
        error, 
        isAuthenticated,
        logout,
        updateUserProfile,
        loadUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
