
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  firstName: 'Tom',
  lastName: 'Brady',
  email: 'tom.brady@example.com',
  phone: '(555) 123-4567',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  dateOfBirth: new Date('1985-05-03'),
  investorType: 'Moderate',
  riskTolerance: 'Medium',
  investmentGoals: ['Retirement', 'College', 'Home Purchase'],
  income: 150000,
  netWorth: 750000,
  title: 'Mr',
  middleName: '',
  suffix: 'none',
  gender: 'Male',
  maritalStatus: 'Single'
};

// Create the context
const UserContext = createContext<UserContextProps | undefined>(undefined);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);

  // Load profile from localStorage on initial mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        // Convert dateOfBirth string back to Date object if it exists
        if (parsedProfile.dateOfBirth) {
          parsedProfile.dateOfBirth = new Date(parsedProfile.dateOfBirth);
        }
        
        // ALWAYS ensure the name is Tom Brady regardless of what's in localStorage
        parsedProfile.firstName = 'Tom';
        parsedProfile.lastName = 'Brady';
        
        setUserProfile(parsedProfile);
        // Update localStorage with the enforced name
        localStorage.setItem('userProfile', JSON.stringify(parsedProfile));
      } else {
        // If no profile exists in localStorage, save the default one
        localStorage.setItem('userProfile', JSON.stringify(defaultUserProfile));
      }
    } catch (error) {
      console.error('Error processing saved profile:', error);
      // If there's an error, reset to default and save it
      localStorage.setItem('userProfile', JSON.stringify(defaultUserProfile));
    }
  }, []);

  // Update user profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prevProfile) => {
      // Always ensure the name is Tom Brady
      const updatedProfile = {
        ...prevProfile,
        ...updates,
        firstName: 'Tom',
        lastName: 'Brady'
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      console.log('Profile updated:', updatedProfile);
      
      return updatedProfile;
    });
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
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
