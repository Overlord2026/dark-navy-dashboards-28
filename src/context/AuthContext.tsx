
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to safely parse date from database
  const parseDateSafely = (dateString: string): Date => {
    if (!dateString) return new Date();
    
    // If it's a date-only string (YYYY-MM-DD), parse it in local timezone
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    
    // For datetime strings, create date object
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const loadUserProfile = async (userId: string) => {
    try {
      console.log("Loading user profile for user:", userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
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
          email: profile.email,
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
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to defer profile loading and prevent auth state deadlock
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setTimeout(() => {
          loadUserProfile(session.user.id);
        }, 0);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData?: any): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<void> => {
    if (!user) return;

    try {
      // Update local state immediately for better UX
      if (userProfile) {
        setUserProfile({ ...userProfile, ...profileData });
      }

      // Update database
      const updateData: any = {};
      if (profileData.firstName !== undefined) updateData.first_name = profileData.firstName;
      if (profileData.lastName !== undefined) updateData.last_name = profileData.lastName;
      if (profileData.displayName !== undefined) updateData.display_name = profileData.displayName;
      if (profileData.email !== undefined) updateData.email = profileData.email;
      if (profileData.phone !== undefined) updateData.phone = profileData.phone;
      if (profileData.dateOfBirth !== undefined) updateData.date_of_birth_date = profileData.dateOfBirth?.toISOString().split('T')[0];

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        // Revert local state on error
        await refreshProfile();
      }
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      await refreshProfile();
    }
  };

  const refreshProfile = async (): Promise<void> => {
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUserProfile,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
