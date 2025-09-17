import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { shouldEnforceAuthentication, isQABypassAllowed } from '@/utils/environment';
import { UserProfile } from '@/types/user';
import { MOCK_MODE } from '@/config/featureFlags';


interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isEmailConfirmed: boolean;
  isQABypassActive: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requires2FA?: boolean; userId?: string }>;
  signup: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithApple: () => Promise<{ success: boolean; error?: string }>;
  signInWithMicrosoft: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  complete2FALogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking2FA, setIsChecking2FA] = useState(false);
  const [isQABypassActive, setIsQABypassActive] = useState(MOCK_MODE);

  // Mock mode user profile
  const mockUserProfile: UserProfile = {
    id: 'mock-user-id',
    name: 'Mock User',
    displayName: 'Mock Admin',
    email: 'mock@example.com',
    firstName: 'Mock',
    lastName: 'User',
    role: 'admin',
    permissions: ['admin'],
    twoFactorEnabled: false,
    tenant_id: 'mock-tenant',
    segments: []
  };

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
        .select('*, two_factor_enabled')
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

        const userProfileData = {
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
          role: (profile.role as UserProfile['role']) || 'client',
          permissions: profile.permissions || [],
          twoFactorEnabled: profile.two_factor_enabled || false,
          tenant_id: profile.tenant_id,
          segments: profile.client_segment ? [profile.client_segment] : [],
          advisor_role: profile.role === 'advisor' ? profile.role : undefined
        };
        
        setUserProfile(userProfileData);
        setIsQABypassActive(isQABypassAllowed(profile.email));
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  useEffect(() => {
    if (MOCK_MODE) {
      // In mock mode, simulate authentication with mock user
      const mockUser = { id: 'mock-user-id', email: 'mock@example.com' } as User;
      const mockSession = { user: mockUser } as Session;
      
      setUser(mockUser);
      setSession(mockSession);
      setUserProfile(mockUserProfile);
      setIsQABypassActive(true);
      setIsLoading(false);
      return;
    }

    // Real auth mode
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
          setIsQABypassActive(false);
        }
        
        setIsLoading(false);
      }
    );

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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; requires2FA?: boolean; userId?: string }> => {
    try {
      setIsLoading(true);
      setIsChecking2FA(true); // Set flag to prevent redirect during 2FA check
      console.log('Starting login process for:', email);
      
      // First, verify credentials and get user ID
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.log('Login error:', error);
        return { success: false, error: error.message };
      }
      
      console.log('Login successful, checking 2FA status for user:', data.user.id);
      
      // Check if user has 2FA enabled while still authenticated
      const { data: profile } = await supabase
        .from('profiles')
        .select('two_factor_enabled, id')
        .eq('id', data.user.id)
        .single();
      
      console.log('Profile data:', profile);
      
      if (profile?.two_factor_enabled) {
        console.log('2FA is enabled for user, signing out and returning 2FA requirement');
        // If 2FA is enabled, sign out and return requires2FA flag
        await supabase.auth.signOut();
        return { 
          success: false, 
          requires2FA: true, 
          userId: profile.id,
          error: 'Two-factor authentication required'
        };
      }
      
      console.log('2FA is not enabled, proceeding with normal login');
      // If no 2FA, proceed with normal login (user is already signed in)
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
      setIsChecking2FA(false); // Clear flag regardless of outcome
    }
  };

  const complete2FALogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
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
      console.error('2FA login completion error:', error);
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
          emailRedirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        return { 
          success: true, 
          error: 'Please check your email and click the confirmation link to complete your registration.' 
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/family/home`
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: 'An unexpected error occurred with Google sign-in' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/family/home`
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Apple sign-in error:', error);
      return { success: false, error: 'An unexpected error occurred with Apple sign-in' };
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithMicrosoft = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/family/home`,
          scopes: 'email'
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Microsoft sign-in error:', error);
      return { success: false, error: 'An unexpected error occurred with Microsoft sign-in' };
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

  const resendConfirmation = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Resend confirmation error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      console.log('Sending password reset with redirect URL:', redirectUrl);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl
      });
      
      if (error) {
        console.error('Reset password error:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'An unexpected error occurred' };
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

  const isEmailConfirmed = user?.email_confirmed_at ? true : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        isAuthenticated: !!user && !isChecking2FA,
        isLoading,
        isEmailConfirmed,
        isQABypassActive,
        login,
        signup,
        signInWithGoogle,
        signInWithApple,
        signInWithMicrosoft,
        logout,
        updateUserProfile,
        refreshProfile,
        resendConfirmation,
        resetPassword,
        complete2FALogin
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
