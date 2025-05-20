
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  role?: string;
  email?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any | null, user: User | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Handle profile fetching separately to avoid auth deadlocks
  const fetchProfile = async (userId: string) => {
    if (!userId) return null;
    
    try {
      // Query the profiles table we just created
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  // Initialize auth
  useEffect(() => {
    // Important: first check for existing session before setting up listener
    // to avoid race conditions
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        console.log('Initializing Supabase auth...');
        
        // Get existing session first
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        // Update state based on initial session
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        
        if (initialSession?.user) {
          console.log('Found existing authenticated session');
          // Don't wait for profile fetch to complete the initialization
          fetchProfile(initialSession.user.id).then(profileData => {
            if (profileData) {
              setProfile(profileData);
            }
          });
        } else {
          console.log('No existing authenticated session');
        }
        
        setAuthInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthInitialized(true); // Still mark as initialized even on error
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Set up auth state listener after initialization
  useEffect(() => {
    if (!authInitialized) return;
    
    console.log('Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state changed:', event);
        
        // Update session and user synchronously
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Handle profile fetch with setTimeout to avoid deadlocks
        if (newSession?.user) {
          // Use setTimeout to defer profile fetch
          setTimeout(() => {
            fetchProfile(newSession.user.id).then(profileData => {
              if (profileData) {
                setProfile(profileData);
              }
            });
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [authInitialized]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        return { error };
      }
      return { error: null };
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      toast.error('An unexpected error occurred during sign in');
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        }
      });

      if (error) {
        toast.error(error.message);
        return { error, user: null };
      }

      toast.success('Please check your email to confirm your account');
      return { error: null, user: data.user };
    } catch (error) {
      console.error('Unexpected error during sign up:', error);
      toast.error('An unexpected error occurred during sign up');
      return { error, user: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Profile will be cleared by auth state change event
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Error during Google sign in:', error);
      toast.error('Failed to sign in with Google');
    }
  };

  const signInWithMicrosoft = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Error during Microsoft sign in:', error);
      toast.error('Failed to sign in with Microsoft');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }
    
    try {
      // Update the profiles table
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) {
        toast.error('Failed to update profile');
        return { error };
      }
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An unexpected error occurred while updating your profile');
      return { error };
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithMicrosoft,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within an AuthProvider');
  }
  return context;
}
