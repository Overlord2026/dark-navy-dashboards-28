
import { useState, useEffect, createContext, useContext } from "react";
import { Professional } from "@/types/professional";

// Sample professionals data
const sampleProfessionals: Professional[] = [
  {
    id: "pro-1",
    name: "Sarah Johnson",
    type: "Accountant/CPA",
    company: "Johnson Tax & Accounting",
    phone: "(555) 123-4567",
    email: "sarah.johnson@example.com",
    website: "https://johnsontax.example.com",
    address: "123 Finance St, New York, NY 10001",
    notes: "Handles our personal and business tax returns. Has been our accountant for 5 years.",
    rating: 4.5
  },
  {
    id: "pro-2",
    name: "Michael Chen",
    type: "Financial Advisor",
    company: "Chen Wealth Management",
    phone: "(555) 987-6543",
    email: "michael.chen@example.com",
    website: "https://chenwm.example.com",
    address: "456 Wealth Ave, Chicago, IL 60601",
    notes: "Manages our retirement accounts and college savings plans.",
    rating: 5
  },
  {
    id: "pro-3",
    name: "Jennifer Williams",
    type: "Attorney",
    company: "Williams & Partners Law Firm",
    phone: "(555) 456-7890",
    email: "jennifer.williams@example.com",
    website: "https://williamslaw.example.com",
    address: "789 Legal Blvd, Boston, MA 02108",
    notes: "Helped with our estate planning and wills.",
    rating: 4
  }
];

// Create context
type ProfessionalsContextType = {
  professionals: Professional[];
  addProfessional: (professional: Professional) => void;
  updateProfessional: (professional: Professional) => void;
  removeProfessional: (id: string) => void;
};

const ProfessionalsContext = createContext<ProfessionalsContextType | undefined>(undefined);

// Provider component
export const ProfessionalsProvider = ({ children }: { children: React.ReactNode }) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);

  // Load professionals from localStorage on mount
  useEffect(() => {
    const savedProfessionals = localStorage.getItem("professionals");
    if (savedProfessionals) {
      setProfessionals(JSON.parse(savedProfessionals));
    } else {
      // Use sample data if nothing is saved
      setProfessionals(sampleProfessionals);
    }
  }, []);

  // Save professionals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("professionals", JSON.stringify(professionals));
  }, [professionals]);

  const addProfessional = (professional: Professional) => {
    setProfessionals(prev => [...prev, professional]);
  };

  const updateProfessional = (updatedProfessional: Professional) => {
    setProfessionals(prev => 
      prev.map(pro => 
        pro.id === updatedProfessional.id ? updatedProfessional : pro
      )
    );
  };

  const removeProfessional = (id: string) => {
    setProfessionals(prev => prev.filter(pro => pro.id !== id));
  };

  return (
    <ProfessionalsContext.Provider value={{ 
      professionals, 
      addProfessional, 
      updateProfessional, 
      removeProfessional 
    }}>
      {children}
    </ProfessionalsContext.Provider>
  );
};

// Hook for using the professionals context
export const useProfessionals = () => {
  const context = useContext(ProfessionalsContext);
  if (context === undefined) {
    throw new Error("useProfessionals must be used within a ProfessionalsProvider");
  }
  return context;
};
