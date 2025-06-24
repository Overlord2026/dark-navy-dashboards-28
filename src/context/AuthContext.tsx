import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { sendOTPEmail } from '@/services/otpEmailService';

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
  isEmailConfirmed: boolean;
  requiresOTP: boolean;
  pendingUserId: string | null;
  pendingEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresOTP?: boolean; userId?: string }>;
  signup: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  requestOTP: (email: string, userId: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (otp: string, userId: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const parseDateSafely = (dateString: string): Date => {
    if (!dateString) return new Date();
    
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    
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

  const requestOTP = async (email: string, userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set expiration to 5 minutes from now
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

      // Check rate limiting - max 3 OTP requests per 10 minutes
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { data: recentCodes, error: countError } = await supabase
        .from('user_otp_codes')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', tenMinutesAgo);

      if (countError) {
        throw new Error('Failed to check rate limit');
      }

      if (recentCodes && recentCodes.length >= 3) {
        return { success: false, error: 'Too many OTP requests. Please wait 10 minutes before requesting again.' };
      }

      // Store OTP in database
      const { error: insertError } = await supabase
        .from('user_otp_codes')
        .insert({
          user_id: userId,
          otp_code: otpCode,
          expires_at: expiresAt
        });

      if (insertError) {
        throw new Error(`Failed to store OTP: ${insertError.message}`);
      }

      // Send email using the new OTP email service
      const emailSuccess = await sendOTPEmail({
        userEmail: email,
        userName: 'User',
        otpCode: otpCode
      });

      if (!emailSuccess) {
        return { success: false, error: 'Failed to send OTP email' };
      }
      
      return { success: true };
    } catch (error) {
      console.error('OTP request error:', error);
      return { success: false, error: 'Failed to send OTP' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; requiresOTP?: boolean; userId?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await supabase.auth.signOut();
        
        setRequiresOTP(true);
        setPendingUserId(data.user.id);
        setPendingEmail(email);
        
        const otpResult = await requestOTP(email, data.user.id);
        if (!otpResult.success) {
          return { success: false, error: otpResult.error };
        }
        
        return { success: true, requiresOTP: true, userId: data.user.id };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (otp: string, userId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.rpc('validate_otp_code', {
        p_user_id: userId,
        p_otp_code: otp
      });

      if (error) {
        return { success: false, error: 'Failed to verify OTP' };
      }

      if (!data) {
        return { success: false, error: 'Invalid or expired OTP code' };
      }

      setRequiresOTP(false);
      setPendingUserId(null);
      setPendingEmail(null);
      
      window.location.href = '/client-dashboard';
      
      return { success: true };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, error: 'Failed to verify OTP' };
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
          redirectTo: `${window.location.origin}/client-dashboard`
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

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUserProfile(null);
      setRequiresOTP(false);
      setPendingUserId(null);
      setPendingEmail(null);
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
        isAuthenticated: !!user,
        isLoading,
        isEmailConfirmed,
        requiresOTP,
        pendingUserId,
        pendingEmail,
        login,
        signup,
        signInWithGoogle,
        logout,
        updateUserProfile,
        refreshProfile,
        resendConfirmation,
        resetPassword,
        requestOTP,
        verifyOTP
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
