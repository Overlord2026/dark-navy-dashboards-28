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
}

// Create the context with a default value
const UserContext = createContext<UserContextType>({
  userProfile: null,
  setUserProfile: () => {},
  isLoading: true,
  error: null,
});

// Create a provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
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
    
    fetchUserProfile();
    
    // Subscribe to auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        fetchUserProfile();
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
      middleName: userData.middle_name || '', // Added with default
      displayName: userData.display_name || '',
      role: userData.role || 'client',
      avatar: userData.avatar_url || '',
      title: userData.title || '',
      suffix: userData.suffix || '', // Added with default
      gender: userData.gender || '', // Added with default
      maritalStatus: userData.marital_status || '', // Added with default
      dateOfBirth: userData.date_of_birth ? new Date(userData.date_of_birth) : null, // Handle with default
      phone: userData.phone || '', // Added with default
      investorType: userData.investor_type || '', // Added with default
      createdAt: userData.created_at,
      permissions: userData.permissions || [], // Added with default
    };
  };

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, isLoading, error }}>
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
