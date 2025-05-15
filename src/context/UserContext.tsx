
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

// Define an extended profile type that includes all the possible fields from Supabase
interface ProfileData {
  id: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string; 
  display_name?: string;
  title?: string;
  suffix?: string;
  gender?: string;
  marital_status?: string;
  date_of_birth?: string;
  phone?: string;
  investor_type?: string;
  role?: string;
  permissions?: string[];
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow for other fields
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, session, isAuthenticated: supabaseIsAuthenticated, signIn, signOut } = useSupabaseAuth();
  const [userLoaded, setUserLoaded] = useState(false);

  // Load user profile data when auth state changes
  useEffect(() => {
    // When auth state is determined, determine if we need to load user data
    const checkAuthState = async () => {
      // Clear timeout if component unmounts
      if (user && !userLoaded) {
        console.log('UserContext: Auth state detected user, loading data');
        await loadUserData();
      } else if (!user) {
        console.log('UserContext: No authenticated user');
        setUserProfile(null);
        setUserLoaded(false);
        setIsLoading(false);
      }
    };
    
    checkAuthState();
  }, [user]); // Only depend on user, not on session

  const loadUserData = async () => {
    if (!user) {
      console.log('UserContext: loadUserData called but no user');
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      console.log('UserContext: Loading user data for', user.id);
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

      // Cast profileData to our extended type
      const typedProfileData = profileData as unknown as ProfileData;

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
        firstName: typedProfileData?.first_name || undefined,
        lastName: typedProfileData?.last_name || undefined,
        middleName: typedProfileData?.middle_name || undefined,
        displayName: typedProfileData?.display_name || user.email?.split('@')[0] || 'User',
        name: typedProfileData?.first_name && typedProfileData?.last_name 
          ? `${typedProfileData.first_name} ${typedProfileData.last_name}` 
          : typedProfileData?.display_name || user.email?.split('@')[0] || 'User',
        role: typedProfileData?.role as UserProfile['role'] || userRole,
        title: typedProfileData?.title || undefined,
        suffix: typedProfileData?.suffix || undefined,
        gender: typedProfileData?.gender || undefined,
        maritalStatus: typedProfileData?.marital_status || undefined,
        dateOfBirth: typedProfileData?.date_of_birth ? new Date(typedProfileData.date_of_birth) : undefined,
        phone: typedProfileData?.phone || undefined,
        investorType: typedProfileData?.investor_type || undefined,
        avatar_url: typedProfileData?.avatar_url || undefined,
        permissions: typedProfileData?.permissions || [],
      };
      
      console.log('UserContext: User data loaded successfully');
      setUserProfile(mappedProfile);
      setUserLoaded(true);
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
      setUserLoaded(false);
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
