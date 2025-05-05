
import React, { createContext, useContext, useState } from "react";

interface AdvisorInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  certifications: string[];
  linkedin?: string;
}

interface AdvisorContextType {
  advisorInfo: AdvisorInfo;
  updateAdvisorInfo: (info: Partial<AdvisorInfo>) => void;
}

const defaultAdvisorInfo: AdvisorInfo = {
  name: "John Smith",
  title: "Senior Financial Advisor",
  email: "john.smith@example.com",
  phone: "(555) 123-4567",
  location: "New York, NY",
  bio: "Experienced financial advisor with over 15 years of expertise in wealth management and estate planning.",
  certifications: ["CFP", "CFA"],
  linkedin: "https://linkedin.com/in/johnsmith"
};

const AdvisorContext = createContext<AdvisorContextType | undefined>(undefined);

export const AdvisorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [advisorInfo, setAdvisorInfo] = useState<AdvisorInfo>(defaultAdvisorInfo);

  const updateAdvisorInfo = (info: Partial<AdvisorInfo>) => {
    setAdvisorInfo(prev => ({ ...prev, ...info }));
  };

  return (
    <AdvisorContext.Provider value={{ advisorInfo, updateAdvisorInfo }}>
      {children}
    </AdvisorContext.Provider>
  );
};

export const useAdvisor = (): AdvisorContextType => {
  const context = useContext(AdvisorContext);
  if (context === undefined) {
    throw new Error("useAdvisor must be used within an AdvisorProvider");
  }
  return context;
};
