
import React, { createContext, useContext, useState, ReactNode } from "react";

type UserProfile = {
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfBirth?: Date;
  email?: string;
  phone?: string;
  investorType?: string;
};

interface UserContextType {
  userProfile: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => void;
}

const defaultUserProfile: UserProfile = {
  firstName: "Antonio",
  lastName: "Gomez",
  middleName: "Pedro",
  email: "votepedro1999@gmail.com",
  phone: "(941) 539-8751",
  investorType: "Aggressive Growth",
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);

  const updateUserProfile = (data: Partial<UserProfile>) => {
    console.log("Updating user profile with:", data);
    
    // Validate date object if present
    if (data.dateOfBirth) {
      console.log("Date of birth type:", typeof data.dateOfBirth);
      console.log("Date of birth value:", data.dateOfBirth);
      
      // Ensure it's a proper Date object
      if (!(data.dateOfBirth instanceof Date) || isNaN(data.dateOfBirth.getTime())) {
        console.error("Invalid date format received");
        // Try to fix if possible
        if (typeof data.dateOfBirth === 'string') {
          try {
            data.dateOfBirth = new Date(data.dateOfBirth);
            console.log("Converted string to date:", data.dateOfBirth);
          } catch (e) {
            console.error("Failed to convert string to date:", e);
            delete data.dateOfBirth;
          }
        } else {
          // Invalid date, remove from update
          delete data.dateOfBirth;
        }
      }
    }
    
    setUserProfile(prevProfile => {
      const newProfile = {
        ...prevProfile,
        ...data,
      };
      console.log("Updated profile:", newProfile);
      return newProfile;
    });
  };

  return (
    <UserContext.Provider value={{ userProfile, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
