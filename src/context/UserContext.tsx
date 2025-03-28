
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
    setUserProfile(prevProfile => ({
      ...prevProfile,
      ...data,
    }));
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
