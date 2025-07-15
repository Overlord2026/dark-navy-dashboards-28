
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface AdvisorInfo {
  name: string;
  title: string;
  location: string;
  email: string;
  serviceEmail?: string;
  phone: string;
  office: string;
  bio: string;
  linkedin?: string;
  hometown?: string;
  experience?: Experience[];
  certifications?: string[];
  education?: string[];
  specialties?: string[];
}

interface AdvisorContextType {
  advisorInfo: AdvisorInfo;
  updateAdvisorInfo: (info: Partial<AdvisorInfo>) => void;
}

const defaultAdvisorInfo: AdvisorInfo = {
  name: "Tony Gomes",
  title: "Certified Financial Planner™",
  location: "Sarasota, FL",
  email: "tony@awmfl.com",
  serviceEmail: "Service@awmfl.com",
  phone: "(800) 555-1234",
  office: "Sarasota, FL",
  hometown: "Asheville, NC",
  bio: "Daniel, a seasoned finance professional, guides high net worth investors. His approach blends investment management, risk mitigation, tax optimization, and overall strategy. Starting at Vanguard, then UBS, he directed client acquisition at Fisher Investments before joining BFO. Originally from Asheville, NC, Daniel now resides in Sarasota, enjoying fitness, community activities, and sunny days by the water.",
  experience: [
    {
      title: "Senior Financial Advisor",
      company: "Vanguard",
      period: "2015-2018",
      description: "Managed portfolios for high net worth individuals and provided strategic investment advice."
    },
    {
      title: "Wealth Management Consultant",
      company: "UBS",
      period: "2018-2020",
      description: "Developed comprehensive financial plans for clients with complex financial situations."
    }
  ],
  certifications: ["CFP®", "ChFC®", "RICP®"],
  education: ["BS, Finance", "Executive Financial Planning Program"],
  specialties: ["Retirement Planning", "Tax Optimization", "Estate Planning"]
};

const AdvisorContext = createContext<AdvisorContextType | undefined>(undefined);

export const AdvisorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [advisorInfo, setAdvisorInfo] = useState<AdvisorInfo>(defaultAdvisorInfo);

  const updateAdvisorInfo = (info: Partial<AdvisorInfo>) => {
    setAdvisorInfo(prevInfo => ({
      ...prevInfo,
      ...info
    }));
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
    throw new Error('useAdvisor must be used within an AdvisorProvider');
  }
  return context;
};
