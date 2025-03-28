
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the user profile interface
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: Date | null;
  investorType: string;
  riskTolerance: string;
  investmentGoals: string[];
  income: number;
  netWorth: number;
  // Added missing properties
  title: string;
  middleName: string;
  suffix: string;
  gender: string;
  maritalStatus: string;
}

// Define the context interface
interface UserContextProps {
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  isProfileComplete: boolean;
}

// Set default user profile
const defaultUserProfile: UserProfile = {
  firstName: 'Antonio',
  lastName: 'Gomez',
  email: 'antonio.gomez@example.com',
  phone: '(555) 123-4567',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  dateOfBirth: null,
  investorType: 'Moderate',
  riskTolerance: 'Medium',
  investmentGoals: ['Retirement', 'College', 'Home Purchase'],
  income: 150000,
  netWorth: 750000,
  // Added default values for the new properties
  title: 'Mr.',
  middleName: '',
  suffix: '',
  gender: 'Male',
  maritalStatus: 'Single'
};

// Create the context
const UserContext = createContext<UserContextProps | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);

  // Update user profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      ...updates,
    }));
  };

  // Check if profile is complete
  const isProfileComplete = Boolean(
    userProfile.firstName &&
    userProfile.lastName &&
    userProfile.email &&
    userProfile.phone
  );

  return (
    <UserContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        isProfileComplete,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Create a hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
