import React, { createContext, useContext, useState } from 'react';

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}

interface AdvisorContextType {
  advisorInfo: {
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
    certifications: string[];
    experience?: Experience[];
  };
  updateAdvisorInfo: (info: Partial<{
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
    certifications: string[];
    experience?: Experience[];
  }>) => void;
}

const AdvisorContext = createContext<AdvisorContextType | undefined>(undefined);

export function AdvisorProvider({ children }: { children: React.ReactNode }) {
  const [advisorInfo, setAdvisorInfo] = useState<AdvisorContextType['advisorInfo']>({
    name: "Daniel Herrera",
    title: "Certified Financial Planner™",
    location: "Sarasota, FL",
    email: "daniel.herrera@awmfl.com",
    serviceEmail: "service@awmfl.com",
    phone: "(800) 555-1234",
    office: "Sarasota, FL",
    bio: "Daniel, a seasoned finance professional, guides high net worth investors through complex financial landscapes. His comprehensive approach integrates investment management, risk mitigation, tax optimization, and overall financial strategy.\n\nBeginning his career at Vanguard, Daniel honed his skills at UBS before directing client acquisition at Fisher Investments. He now brings his expertise to our firm, where he helps clients achieve their long-term financial objectives.\n\nOriginally from Asheville, NC, Daniel now resides in Sarasota, where he enjoys fitness activities, community involvement, and enjoying the coastal lifestyle.",
    linkedin: "https://www.linkedin.com/in/daniel-herrera-cfp%C2%AE-55ab1315/",
    hometown: "Asheville, NC",
    certifications: ["CFP®", "Series 7", "Series 66"],
    experience: [
      {
        title: "Financial Advisor",
        company: "AWM",
        period: "2020 - Present",
        description: "Provide financial advice to high net worth individuals."
      },
      {
        title: "Client Acquisition",
        company: "Fisher Investments",
        period: "2018 - 2020",
        description: "Directed client acquisition efforts."
      }
    ]
  });

  const updateAdvisorInfo = (info: Partial<AdvisorContextType['advisorInfo']>) => {
    setAdvisorInfo(prev => ({ ...prev, ...info }));
  };

  return (
    <AdvisorContext.Provider value={{ advisorInfo, updateAdvisorInfo }}>
      {children}
    </AdvisorContext.Provider>
  );
}

export function useAdvisor() {
  const context = useContext(AdvisorContext);
  if (context === undefined) {
    throw new Error('useAdvisor must be used within an AdvisorProvider');
  }
  return context;
}
