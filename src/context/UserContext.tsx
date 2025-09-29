
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/user';

export type { UserProfile };


interface UserContextType {
  userProfile: UserProfile | null;
  supabaseUser: any | null; // Raw Supabase user with app_metadata
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  refreshUserProfile: () => Promise<UserProfile | null>;
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
    // Use the profile from AuthContext when available
    if (authUserProfile) {
      setUserProfile(authUserProfile);
      setIsLoading(false);
    } else if (user && session) {
      const loadUserProfile = async () => {
        try {
          console.log("Loading user profile for user:", user.id);
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*, two_factor_enabled')
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
               role: (profile.role || 'client') as any,
              permissions: profile.permissions || [],
              twoFactorEnabled: profile.two_factor_enabled || false,
              client_segment: profile.client_segment,
               client_tier: ((profile as any).client_tier || 'basic') as any,
              utm_source: profile.utm_source,
              utm_medium: profile.utm_medium,
              utm_campaign: profile.utm_campaign,
              ghl_contact_id: profile.ghl_contact_id,
              lead_stage: profile.lead_stage,
              advisor_id: profile.advisor_id,
              email_opt_in: profile.email_opt_in,
              sms_opt_in: profile.sms_opt_in,
              last_login_at: profile.last_login_at ? new Date(profile.last_login_at) : undefined,
              last_active_at: profile.last_active_at ? new Date(profile.last_active_at) : undefined
            });
          }
        } catch (error) {
          console.error('Error in loadUserProfile:', error);
          setUserProfile(null);
        }
        setIsLoading(false);
      };

      loadUserProfile();
    } else {
      setUserProfile(null);
      setIsLoading(false);
    }
  }, [user, session, authUserProfile]);

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
        
        // For critical updates like 2FA, also refresh from database
        if (profile.hasOwnProperty('twoFactorEnabled')) {
          setTimeout(async () => {
            await refreshUserProfile();
          }, 100);
        }
      } catch (error) {
        console.error('Error in updateUserProfile:', error);
      }
    }
  };

  const refreshUserProfile = async (): Promise<UserProfile | null> => {
    if (user) {
      try {
        console.log("Refreshing user profile from database for user:", user.id);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*, two_factor_enabled')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile during refresh:', error);
          return null;
        }

        if (profile) {
          console.log("Refreshed profile from database:", profile);
          
          // Handle date conversion properly
          let dateOfBirth: Date | undefined;
          if (profile.date_of_birth_date) {
            dateOfBirth = parseDateSafely(profile.date_of_birth_date);
          } else if (profile.date_of_birth) {
            dateOfBirth = parseDateSafely(profile.date_of_birth);
          }

          const updatedProfile: UserProfile = {
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
              role: (profile.role || 'client') as any,
              permissions: profile.permissions || [],
              twoFactorEnabled: profile.two_factor_enabled || false,
               client_segment: profile.client_segment,
               client_tier: ((profile as any).client_tier || 'basic') as any,
               utm_source: profile.utm_source,
              utm_medium: profile.utm_medium,
              utm_campaign: profile.utm_campaign,
              ghl_contact_id: profile.ghl_contact_id,
              lead_stage: profile.lead_stage,
              advisor_id: profile.advisor_id,
              email_opt_in: profile.email_opt_in,
              sms_opt_in: profile.sms_opt_in,
              last_login_at: profile.last_login_at ? new Date(profile.last_login_at) : undefined,
              last_active_at: profile.last_active_at ? new Date(profile.last_active_at) : undefined
          };

          setUserProfile(updatedProfile);
          return updatedProfile;
        }
      } catch (error) {
        console.error('Error in refreshUserProfile:', error);
      }
    }
    return null;
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        supabaseUser: user, // Expose raw Supabase user with app_metadata
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUserProfile,
        refreshUserProfile
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
