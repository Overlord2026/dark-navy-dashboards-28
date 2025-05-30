
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  email?: string;
}

interface UserContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Create a basic user profile from auth user
      setUserProfile({
        id: user.id,
        first_name: user.user_metadata?.first_name,
        last_name: user.user_metadata?.last_name,
        display_name: user.user_metadata?.display_name || `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim(),
        email: user.email
      });
    } else {
      setUserProfile(null);
    }
    setLoading(false);
  }, [user, isAuthenticated]);

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...profile });
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, loading, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};
