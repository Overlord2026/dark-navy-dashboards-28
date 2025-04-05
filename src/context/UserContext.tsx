
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUserProfile, UserProfile } from '@/data/mock/userProfile';

interface UserContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prevProfile => ({
      ...prevProfile,
      ...updates,
      updatedAt: new Date().toISOString()
    }));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would make an API call to authenticate
    try {
      // Mock successful login
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ 
      isAuthenticated, 
      userProfile, 
      updateUserProfile,
      login,
      logout 
    }}>
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
