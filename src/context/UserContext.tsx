
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

export type UserRole = "client" | "admin" | "advisor" | "system_administrator";

export interface UserProfile {
  id: string;
  displayName: string; // Added displayName property for the user
  email: string;
  role: UserRole;
  company?: string;
  clientId?: string;
  clientCount?: number;
  isDemo?: boolean;
}

interface UserContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  setUserProfile: (profile: UserProfile | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user data for development
const mockUserProfiles: Record<UserRole, UserProfile> = {
  client: {
    id: "client-123",
    displayName: "Tom Brady",
    email: "client@example.com",
    role: "client"
  },
  admin: {
    id: "admin-456",
    displayName: "Admin User",
    email: "admin@example.com",
    role: "admin",
    company: "Wealth Management Firm"
  },
  advisor: {
    id: "advisor-789",
    displayName: "Financial Advisor",
    email: "advisor@example.com",
    role: "advisor",
    company: "Financial Planning Co.",
    clientCount: 15
  },
  system_administrator: {
    id: "sysadmin-101",
    displayName: "System Administrator",
    email: "sysadmin@example.com",
    role: "system_administrator",
    company: "Wealth Management Firm"
  }
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <UserContext.Provider value={{ userProfile, isLoading, setUserProfile }}>
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
