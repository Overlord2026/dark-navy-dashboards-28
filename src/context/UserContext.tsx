
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

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user && session) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading profile:', error);
            setUserProfile(null);
          } else if (profile) {
            setUserProfile({
              id: profile.id,
              name: profile.display_name || `${profile.first_name} ${profile.last_name}`,
              displayName: profile.display_name,
              email: profile.email || user.email,
              firstName: profile.first_name,
              lastName: profile.last_name,
              middleName: profile.middle_name,
              title: profile.title,
              suffix: profile.suffix,
              gender: profile.gender,
              maritalStatus: profile.marital_status,
              dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth) : undefined,
              phone: profile.phone,
              investorType: profile.investor_type,
              role: profile.role || 'client',
              permissions: profile.permissions || []
            });
          } else {
            // Create profile if it doesn't exist
            const newProfile = {
              id: user.id,
              email: user.email,
              first_name: user.user_metadata?.first_name || '',
              last_name: user.user_metadata?.last_name || '',
              display_name: user.user_metadata?.display_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`,
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
        const updateData = {
          first_name: profile.firstName,
          last_name: profile.lastName,
          middle_name: profile.middleName,
          display_name: profile.displayName,
          title: profile.title,
          suffix: profile.suffix,
          gender: profile.gender,
          marital_status: profile.maritalStatus,
          phone: profile.phone,
          investor_type: profile.investorType,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', user.id);

        if (!error) {
          setUserProfile({ ...userProfile, ...profile });
        } else {
          console.error('Error updating profile:', error);
        }
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
