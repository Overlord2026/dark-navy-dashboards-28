
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
    
    // Create a clean copy of the data
    const cleanData = { ...data };
    
    // Handle date of birth specially
    if (data.dateOfBirth) {
      console.log("Date of birth type:", typeof data.dateOfBirth);
      
      // Convert string date to Date object
      if (typeof data.dateOfBirth === 'string') {
        try {
          cleanData.dateOfBirth = new Date(data.dateOfBirth);
          console.log("Converted string to date:", cleanData.dateOfBirth);
        } catch (e) {
          console.error("Failed to convert string to date:", e);
          delete cleanData.dateOfBirth;
        }
      } 
      // Handle serialized date object from form data
      else if (typeof data.dateOfBirth === 'object' && 
              'toString' in data.dateOfBirth &&
              !(data.dateOfBirth instanceof Date)) {
        try {
          // Handle custom date object with possible _type and value properties
          if ('_type' in (data.dateOfBirth as any) && (data.dateOfBirth as any)._type === 'Date') {
            const dateValue = (data.dateOfBirth as any).value;
            if (dateValue) {
              const isoDate = typeof dateValue === 'object' && 'iso' in dateValue ? dateValue.iso : dateValue;
              cleanData.dateOfBirth = new Date(isoDate);
            }
          } else {
            // Generic object conversion
            cleanData.dateOfBirth = new Date(data.dateOfBirth.toString());
          }
          console.log("Converted object to date:", cleanData.dateOfBirth);
        } catch (e) {
          console.error("Failed to convert object to date:", e);
          delete cleanData.dateOfBirth;
        }
      }
      // Validate the date object
      else if (data.dateOfBirth instanceof Date) {
        if (isNaN(data.dateOfBirth.getTime())) {
          console.error("Invalid date format received");
          delete cleanData.dateOfBirth;
        }
      } else {
        console.error("Unhandled date format:", data.dateOfBirth);
        delete cleanData.dateOfBirth;
      }
    }
    
    setUserProfile(prevProfile => {
      const newProfile = {
        ...prevProfile,
        ...cleanData,
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
