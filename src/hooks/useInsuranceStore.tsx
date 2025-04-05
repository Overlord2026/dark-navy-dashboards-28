
import { create } from 'zustand';
import { InsurancePolicy } from '@/types/insurance';
import { getAllMockInsurancePolicies } from '@/data/mock/insurance';

// Define Document type for better type safety
interface InsuranceDocument {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface InsuranceStoreState {
  policies: InsurancePolicy[];
  addPolicy: (policy: InsurancePolicy) => void;
  removePolicy: (id: string) => void;
  updatePolicy: (id: string, updates: Partial<InsurancePolicy>) => void;
  addDocument: (policyId: string, document: string | InsuranceDocument) => void;
  removeDocument: (policyId: string, documentIndex: number) => void;
}

export const useInsuranceStore = create<InsuranceStoreState>((set) => ({
  policies: getAllMockInsurancePolicies(),
  
  addPolicy: (policy) => set((state) => ({
    policies: [...state.policies, policy]
  })),
  
  removePolicy: (id) => set((state) => ({
    policies: state.policies.filter(policy => policy.id !== id)
  })),
  
  updatePolicy: (id, updates) => set((state) => ({
    policies: state.policies.map(policy => 
      policy.id === id ? { ...policy, ...updates } : policy
    )
  })),
  
  addDocument: (policyId, document) => set((state) => ({
    policies: state.policies.map(policy => 
      policy.id === policyId 
        ? { 
            ...policy, 
            documents: [...(policy.documents || []), document] 
          } 
        : policy
    )
  })),
  
  removeDocument: (policyId, documentIndex) => set((state) => ({
    policies: state.policies.map(policy => 
      policy.id === policyId 
        ? {
            ...policy,
            documents: policy.documents?.filter((_, index) => index !== documentIndex)
          }
        : policy
    )
  }))
}));
