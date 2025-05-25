
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Added loadUserData function to fetch user profile
  const loadUserData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("Error fetching user:", authError);
        setError("Failed to fetch user");
        return;
      }
      
      if (authUser.user) {
        // Query the profiles table we just created
        const { data: dbUser, error: dbError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.user.id)
          .single();
          
        if (dbError) {
          console.error("Error fetching profile:", dbError);
          setError("Failed to fetch profile");
          return;
        }
        
        const formattedProfile = formatUserProfile(dbUser);
        setUserProfile(formattedProfile);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Implement logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUserProfile(null);
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
      // Prepare data for Supabase (convert from camelCase to snake_case)
      const profileData = {
        first_name: data.firstName,
        last_name: data.lastName,
        middle_name: data.middleName,
        display_name: data.displayName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        role: data.role,
        avatar_url: data.avatar,
        title: data.title,
        suffix: data.suffix,
        gender: data.gender,
        marital_status: data.maritalStatus,
        date_of_birth: data.dateOfBirth ? data.dateOfBirth.toISOString() : null,
        phone: data.phone,
        investor_type: data.investorType,
      };
      
      // Update the profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userProfile.id);
        
      if (updateError) {
        console.error("Error updating profile:", updateError);
        setError("Failed to update profile");
        return false;
      }
      
      // Update local state with new data
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      return true;
    } catch (err) {
      console.error("Unexpected error updating profile:", err);
      setError("An unexpected error occurred while updating profile");
      return false;
    }
  };

  useEffect(() => {
    loadUserData();
    
    // Subscribe to auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        loadUserData();
      } else if (event === 'SIGNED_OUT') {
        setUserProfile(null);
      }
    });
  }, []);

  const formatUserProfile = (userData: any) => {
    if (!userData) return null;
    
    // Ensure all required fields have default values
    return {
      id: userData.id,
      name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.display_name || 'User',
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
      createdAt: userData.created_at,
      permissions: userData.permissions || [],
    };
  };

  return (
    <UserContext.Provider 
      value={{ 
        userProfile, 
        setUserProfile, 
        isLoading, 
        error, 
        isAuthenticated: !!userProfile,
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
