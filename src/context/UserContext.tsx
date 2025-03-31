
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

export type UserRole = "client" | "admin" | "advisor" | "system_administrator" | "developer" | "consultant";

export interface UserProfile {
  id: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: UserRole;
  company?: string;
  clientId?: string;
  clientCount?: number;
  isDemo?: boolean;
  title?: string;
  middleName?: string;
  suffix?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfBirth?: Date | string;
  investorType?: string;
  name?: string;
  updateUserProfile?: (profile: Partial<UserProfile>) => void;
}

interface UserContextType {
  userProfile: UserProfile;
  isLoading: boolean;
  setUserProfile: (profile: UserProfile | null) => void;
  updateUserProfile?: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data for development
const mockUserProfiles: Record<UserRole, UserProfile> = {
  client: {
    id: "client-123",
    displayName: "Tom Brady",
    firstName: "Tom",
    lastName: "Brady",
    email: "client@example.com",
    phone: "(555) 123-4567",
    role: "client",
    investorType: "High Net Worth Individual"
  },
  admin: {
    id: "admin-456",
    displayName: "Admin User",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    role: "admin",
    company: "Wealth Management Firm"
  },
  advisor: {
    id: "advisor-789",
    displayName: "Financial Advisor",
    firstName: "Financial",
    lastName: "Advisor",
    email: "advisor@example.com",
    role: "advisor",
    company: "Financial Planning Co.",
    clientCount: 15
  },
  system_administrator: {
    id: "sysadmin-101",
    displayName: "System Administrator",
    firstName: "System",
    lastName: "Administrator",
    email: "sysadmin@example.com",
    role: "system_administrator",
    company: "Wealth Management Firm"
  },
  developer: {
    id: "dev-102",
    displayName: "Developer",
    firstName: "Dev",
    lastName: "User",
    email: "developer@example.com",
    role: "developer",
    name: "Developer User"
  },
  consultant: {
    id: "consultant-103",
    displayName: "Consultant",
    firstName: "Consultant",
    lastName: "User",
    email: "consultant@example.com",
    role: "consultant",
    name: "Consultant User"
  }
};

// Convert dateOfBirth strings to Date objects if they exist
Object.values(mockUserProfiles).forEach(profile => {
  if (profile.dateOfBirth && typeof profile.dateOfBirth === 'string') {
    profile.dateOfBirth = new Date(profile.dateOfBirth);
  }
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to update user profile
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  useEffect(() => {
    // Simulate API call to get user profile
    const loadUserProfile = () => {
      setIsLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
        // For development, we'll use the client user by default
        // In a real application, this would come from an API call or auth service
        const storedRole = localStorage.getItem("userRole") as UserRole || "client";
        setUserProfile(mockUserProfiles[storedRole] || mockUserProfiles.client);
        setIsLoading(false);
      }, 800);
    };

    loadUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ 
      userProfile: userProfile as UserProfile, 
      isLoading, 
      setUserProfile,
      updateUserProfile 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
