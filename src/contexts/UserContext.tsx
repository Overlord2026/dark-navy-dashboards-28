import React, { createContext, useContext, useState, useEffect } from 'react';

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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading user data from storage or an API
  useEffect(() => {
    // In a real app, this would fetch the user profile from an API
    const loadUser = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For demo purposes, create a mock admin user
        const mockUser: UserProfile = {
          id: 'user-123',
          name: 'Admin User',
          displayName: 'Admin',
          email: 'admin@example.com',
          firstName: 'Tom',
          lastName: 'Brady',
          role: 'admin',
          permissions: ['all'],
          phone: '(555) 123-4567',
          investorType: 'High Net Worth Individual'
        };
        
        setUserProfile(mockUser);
      } catch (error) {
        console.error('Error loading user profile:', error);
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // In a real app, this would make an API call to authenticate
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any credentials and create a mock user
      const mockUser: UserProfile = {
        id: 'user-123',
        name: 'Demo User',
        displayName: email.split('@')[0],
        firstName: 'Tom',
        lastName: 'Brady',
        email,
        role: 'admin',
        permissions: ['all'],
        phone: '(555) 123-4567',
        investorType: 'High Net Worth Individual'
      };
      
      setUserProfile(mockUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // In a real app, this would clear tokens, etc.
    setUserProfile(null);
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
        isAuthenticated: !!userProfile,
        isLoading,
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
