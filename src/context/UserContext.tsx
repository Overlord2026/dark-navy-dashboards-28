
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, session, isAuthenticated, login: authLogin, logout: authLogout } = useAuth();

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
    const loadUserProfile = async () => {
      if (user && session) {
        try {
          console.log("Loading user profile for user:", user.id);
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading profile:', error);
            setUserProfile(null);
          } else if (profile) {
            console.log("Loaded profile from database:", profile);
            
            // Handle date conversion properly
            let dateOfBirth: Date | undefined;
            if (profile.date_of_birth_date) {
              dateOfBirth = parseDateSafely(profile.date_of_birth_date);
            } else if (profile.date_of_birth) {
              dateOfBirth = parseDateSafely(profile.date_of_birth);
            }

            setUserProfile({
              id: profile.id,
              name: profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
              displayName: profile.display_name,
              email: profile.email || user.email,
              firstName: profile.first_name,
              lastName: profile.last_name,
              middleName: profile.middle_name,
              title: profile.title,
              suffix: profile.suffix,
              gender: profile.gender,
              maritalStatus: profile.marital_status,
              dateOfBirth: dateOfBirth,
              phone: profile.phone,
              investorType: profile.investor_type,
              role: profile.role || 'client',
              permissions: profile.permissions || []
            });
          } else {
            // Create profile if it doesn't exist
            console.log("Creating new profile for user:", user.id);
            
            const newProfile = {
              id: user.id,
              email: user.email,
              first_name: user.user_metadata?.first_name || '',
              last_name: user.user_metadata?.last_name || '',
              display_name: user.user_metadata?.display_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim(),
              role: 'client'
            };
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([newProfile]);
              
            if (!insertError) {
              setUserProfile({
                id: user.id,
                name: newProfile.display_name,
                displayName: newProfile.display_name,
                email: newProfile.email,
                firstName: newProfile.first_name,
                lastName: newProfile.last_name,
                role: 'client',
                permissions: []
              });
            }
          }
        } catch (error) {
          console.error('Error in loadUserProfile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    };

    loadUserProfile();
  }, [user, session]);

  const login = async (email: string, password: string): Promise<boolean> => {
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
