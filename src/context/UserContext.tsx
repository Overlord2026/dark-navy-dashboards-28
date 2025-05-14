
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  dateOfBirth?: Date | string;
  phone?: string;
  investorType?: string;
  role: 'client' | 'advisor' | 'admin' | 'system_administrator' | 'developer' | 'consultant' | 'accountant' | 'attorney';
  permissions?: string[];
  avatar_url?: string;
}

interface UserContextType {
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<boolean>;
  loadUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, session, isAuthenticated: supabaseIsAuthenticated, signIn, signOut } = useSupabaseAuth();

  // Load user profile data from Supabase when auth state changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setUserProfile(null);
      setIsLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) {
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch profile data from Supabase
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load user profile');
        setUserProfile(null);
        return;
      }

      // Check for user roles
      let userRole: UserProfile['role'] = 'client'; // Default role
      
      try {
        const { data: rolesData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
          
        if (rolesData && rolesData.length > 0) {
          // Assign the first role found (most systems assign one primary role)
          userRole = rolesData[0].role as UserProfile['role'];
        }
      } catch (roleError) {
        console.error('Error fetching user roles:', roleError);
        // Continue with default role if there's an error
      }

      // Transform Supabase profile data to our UserProfile format
      const mappedProfile: UserProfile = {
        id: user.id,
        email: user.email || undefined,
        firstName: profileData?.first_name || undefined,
        lastName: profileData?.last_name || undefined,
        middleName: profileData?.middle_name || undefined,
        displayName: profileData?.display_name || user.email?.split('@')[0] || 'User',
        name: profileData?.first_name && profileData?.last_name 
          ? `${profileData.first_name} ${profileData.last_name}` 
          : profileData?.display_name || user.email?.split('@')[0] || 'User',
        role: profileData?.role as UserProfile['role'] || userRole,
        title: profileData?.title || undefined,
        suffix: profileData?.suffix || undefined,
        gender: profileData?.gender || undefined,
        maritalStatus: profileData?.marital_status || undefined,
        dateOfBirth: profileData?.date_of_birth ? new Date(profileData.date_of_birth) : undefined,
        phone: profileData?.phone || undefined,
        investorType: profileData?.investor_type || undefined,
        avatar_url: profileData?.avatar_url || undefined,
        permissions: profileData?.permissions || [],
      };
      
      setUserProfile(mappedProfile);
    } catch (error) {
      console.error('Error processing user profile:', error);
      toast.error('Failed to process user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error signing out');
    }
  };

  const updateUserProfile = async (profile: Partial<UserProfile>): Promise<boolean> => {
    if (!userProfile) {
      toast.error('Cannot update profile: User not authenticated');
      return false;
    }

    try {
      // Map our UserProfile format back to Supabase profile format
      const supabaseProfileData: Record<string, any> = {};
      
      if (profile.firstName !== undefined) supabaseProfileData.first_name = profile.firstName;
      if (profile.lastName !== undefined) supabaseProfileData.last_name = profile.lastName;
      if (profile.middleName !== undefined) supabaseProfileData.middle_name = profile.middleName;
      if (profile.displayName !== undefined) supabaseProfileData.display_name = profile.displayName;
      if (profile.title !== undefined) supabaseProfileData.title = profile.title;
      if (profile.phone !== undefined) supabaseProfileData.phone = profile.phone;
      if (profile.gender !== undefined) supabaseProfileData.gender = profile.gender;
      if (profile.maritalStatus !== undefined) supabaseProfileData.marital_status = profile.maritalStatus;
      if (profile.dateOfBirth !== undefined) supabaseProfileData.date_of_birth = profile.dateOfBirth;
      if (profile.suffix !== undefined) supabaseProfileData.suffix = profile.suffix;
      if (profile.investorType !== undefined) supabaseProfileData.investor_type = profile.investorType;
      
      // Only update if we have something to update
      if (Object.keys(supabaseProfileData).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(supabaseProfileData)
          .eq('id', userProfile.id);
        
        if (error) {
          console.error('Error updating profile:', error);
          toast.error('Failed to update profile');
          return false;
        }
        
        // Update local state after successful database update
        setUserProfile(prev => prev ? { ...prev, ...profile } : null);
        toast.success('Profile updated successfully');
        return true;
      }
      return true;
    } catch (error) {
      console.error('Error in updateUserProfile:', error);
      toast.error('An unexpected error occurred while updating your profile');
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        isAuthenticated: supabaseIsAuthenticated && !!userProfile,
        isLoading,
        login,
        logout,
        updateUserProfile,
        loadUserData
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
