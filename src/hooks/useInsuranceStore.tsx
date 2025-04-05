
import { create } from "zustand";
import { InsurancePolicy, InsurancePolicyType } from "@/types/insurance";

interface InsuranceStoreState {
  policies: InsurancePolicy[];
  policyTypes: { id: InsurancePolicyType; name: string }[];
  addPolicy: (policy: InsurancePolicy) => void;
  updatePolicy: (id: string, policy: Partial<InsurancePolicy>) => void;
  removePolicy: (id: string) => void;
  addDocumentToPolicy: (policyId: string, document: { id: string; name: string; url: string; type: string }) => void;
  removeDocumentFromPolicy: (policyId: string, documentId: string) => void;
  totalPremium: number;
  totalCoverage: number;
}

// For demo purposes, this is using clientside state
// In a real application, this would be stored in a database
export const useInsuranceStore = create<InsuranceStoreState>((set, get) => ({
  policies: [
    {
      id: "policy-1",
      name: "Term Life Insurance",
      type: "term-life",
      provider: "Prudential",
      premium: 1200,
      frequency: "annually",
      coverageAmount: 500000,
      startDate: "2020-01-15",
      endDate: "2040-01-15",
      beneficiaries: "Jane Doe (Primary), Children (Secondary)",
      policyNumber: "TL-12345678",
      documents: [
        { id: "doc-1", name: "Policy Declaration", url: "#", type: "pdf" }
      ]
    },
    {
      id: "policy-2",
      name: "Home Insurance",
      type: "homeowners",
      provider: "State Farm",
      premium: 2400,
      frequency: "annually",
      coverageAmount: 750000,
      startDate: "2021-05-10",
      policyNumber: "HO-87654321",
      documents: []
    }
  ],
  
  policyTypes: [
    { id: "term-life", name: "Term Life Insurance" },
    { id: "permanent-life", name: "Permanent Life Insurance" },
    { id: "annuity", name: "Annuity" },
    { id: "health", name: "Health Insurance" },
    { id: "long-term-care", name: "Long-Term Care Insurance" },
    { id: "homeowners", name: "Homeowners Insurance" },
    { id: "auto", name: "Auto Insurance" },
    { id: "umbrella", name: "Umbrella Policy" }
  ],
  
  addPolicy: (policy) => {
    set((state) => ({
      policies: [...state.policies, policy]
    }));
  },
  
  updatePolicy: (id, updatedPolicy) => {
    set((state) => ({
      policies: state.policies.map((policy) => 
        policy.id === id ? { ...policy, ...updatedPolicy } : policy
      )
    }));
  },
  
  removePolicy: (id) => {
    set((state) => ({
      policies: state.policies.filter((policy) => policy.id !== id)
    }));
  },
  
  addDocumentToPolicy: (policyId, document) => {
    set((state) => ({
      policies: state.policies.map((policy) => 
        policy.id === policyId 
          ? { 
              ...policy, 
              documents: [...(policy.documents || []), document] 
            } 
          : policy
      )
    }));
  },
  
  removeDocumentFromPolicy: (policyId, documentId) => {
    set((state) => ({
      policies: state.policies.map((policy) => 
        policy.id === policyId 
          ? { 
              ...policy, 
              documents: (policy.documents || []).filter(doc => doc.id !== documentId) 
            } 
          : policy
      )
    }));
  },
  
  get totalPremium() {
    return get().policies.reduce((total, policy) => {
      const annualPremium = policy.frequency === 'monthly' 
        ? policy.premium * 12 
        : policy.frequency === 'quarterly' 
          ? policy.premium * 4 
          : policy.premium;
      return total + annualPremium;
    }, 0);
  },
  
  get totalCoverage() {
    return get().policies.reduce((total, policy) => {
      return total + policy.coverageAmount;
    }, 0);
  }
}));
