
import React, { createContext, useContext, useState, ReactNode } from "react";
import { format, parse, isValid } from "date-fns";

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
  title: "Mr",
  suffix: "none",
  gender: "Male",
  maritalStatus: "Married",
  dateOfBirth: new Date("1963-05-03"),
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
      
      // If it's a string (from form input)
      if (typeof data.dateOfBirth === 'string') {
        try {
          // Try to parse MM/DD/YYYY format
          const parsedDate = parse(data.dateOfBirth, 'MM/dd/yyyy', new Date());
          if (isValid(parsedDate)) {
            cleanData.dateOfBirth = parsedDate;
            console.log("Parsed date string to Date object:", parsedDate);
          } else {
            // Try direct Date constructor as fallback
            const directDate = new Date(data.dateOfBirth);
            if (isValid(directDate)) {
              cleanData.dateOfBirth = directDate;
              console.log("Created Date directly:", directDate);
            } else {
              console.error("Invalid date format:", data.dateOfBirth);
              delete cleanData.dateOfBirth;
            }
          }
        } catch (e) {
          console.error("Failed to parse date string:", e);
          delete cleanData.dateOfBirth;
        }
      } 
      // If it's already a Date object
      else if (data.dateOfBirth instanceof Date) {
        if (isValid(data.dateOfBirth)) {
          cleanData.dateOfBirth = data.dateOfBirth;
        } else {
          console.error("Invalid Date object");
          delete cleanData.dateOfBirth;
        }
      } 
      // Handle serialized date object from form data
      else if (typeof data.dateOfBirth === 'object') {
        try {
          // Handle custom date object with possible properties
          const dateObj = data.dateOfBirth as any;
          
          // Check for common date object formats
          if ('_type' in dateObj && dateObj._type === 'Date') {
            const dateValue = dateObj.value;
            if (dateValue) {
              const isoDate = typeof dateValue === 'object' && 'iso' in dateValue ? dateValue.iso : dateValue;
              const newDate = new Date(isoDate);
              if (isValid(newDate)) {
                cleanData.dateOfBirth = newDate;
                console.log("Converted object to date via _type property:", newDate);
              }
            }
          } 
          // Try to convert to string and parse
          else if (typeof dateObj.toString === 'function') {
            const dateStr = dateObj.toString();
            // Try to detect if it's already in a reasonable format
            if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
              const parsedDate = parse(dateStr, 'MM/dd/yyyy', new Date());
              if (isValid(parsedDate)) {
                cleanData.dateOfBirth = parsedDate;
                console.log("Parsed object toString() to Date:", parsedDate);
              }
            } else {
              // Use direct constructor
              const directDate = new Date(dateStr);
              if (isValid(directDate)) {
                cleanData.dateOfBirth = directDate;
                console.log("Created Date from toString():", directDate);
              }
            }
          }
          
          // If no valid date was set, log error and delete the property
          if (!(cleanData.dateOfBirth instanceof Date) || !isValid(cleanData.dateOfBirth)) {
            console.error("Could not convert complex object to date:", data.dateOfBirth);
            delete cleanData.dateOfBirth;
          }
        } catch (e) {
          console.error("Failed to handle complex date object:", e);
          delete cleanData.dateOfBirth;
        }
      } else {
        console.error("Unhandled date format type:", typeof data.dateOfBirth);
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
