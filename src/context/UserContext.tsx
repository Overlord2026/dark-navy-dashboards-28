
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { logger } from "@/services/logging/loggingService";

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
  session: Session | null;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener and initialize from session
  useEffect(() => {
    // First, set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        logger.info(`Auth state change: ${event}`, {}, 'UserProvider');
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid Supabase SDK deadlock
          setTimeout(() => {
            updateUserProfileFromSession(currentSession.user);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUserProfile(null);
        }
      }
    );

    // Then, check for existing session
    const initializeFromSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          await updateUserProfileFromSession(initialSession.user);
        }
      } catch (error) {
        logger.error('Error initializing from session:', error, 'UserProvider');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeFromSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateUserProfileFromSession = async (user: User) => {
    try {
      // For demo purposes, create a mock user profile from the auth user
      // In a real app, you would fetch this data from a profiles table
      const mockUser: UserProfile = {
        id: user.id,
        name: user.user_metadata?.full_name || 'Demo User',
        displayName: user.email?.split('@')[0] || user.user_metadata?.preferred_username,
        firstName: user.user_metadata?.first_name || 'Tom',
        lastName: user.user_metadata?.last_name || 'Brady',
        email: user.email,
        role: 'admin',
        permissions: ['all'],
        phone: user.phone || '(555) 123-4567',
        investorType: 'High Net Worth Individual'
      };
      
      setUserProfile(mockUser);
    } catch (error) {
      logger.error('Error updating user profile from session:', error, 'UserProvider');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        logger.error('Login error:', error, 'UserProvider');
        return false;
      }
      
      return true;
    } catch (error) {
      logger.error('Login error:', error, 'UserProvider');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUserProfile(null);
      setSession(null);
      setUser(null);
    } catch (error) {
      logger.error('Logout error:', error, 'UserProvider');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...profile });
    }
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        isAuthenticated: !!session,
        isLoading,
        session,
        user,
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
