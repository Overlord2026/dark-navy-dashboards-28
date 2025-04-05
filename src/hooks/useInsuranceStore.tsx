
import { create } from 'zustand';
import { InsurancePolicy } from '@/types/insurance';
import { getAllMockInsurancePolicies } from '@/data/mock/insurance';

// Define the policy types for the dashboard
export interface PolicyType {
  id: string;
  name: string;
}

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
  addDocument: (policyId: string, document: string) => void;
  removeDocument: (policyId: string, documentIndex: number) => void;
  // Computed properties
  policyTypes: PolicyType[];
  totalPremium: number;
  totalCoverage: number;
}

export const useInsuranceStore = create<InsuranceStoreState>((set, get) => ({
  policies: getAllMockInsurancePolicies(),
  
  addPolicy: (policy) => set((state) => ({
    // TODO: Replace with real endpoint: POST /api/insurance/policies
    // This endpoint should create a new insurance policy
    // Request body: policy data
    // Response: newly created policy with ID
    policies: [...state.policies, policy]
  })),
  
  removePolicy: (id) => set((state) => ({
    // TODO: Replace with real endpoint: DELETE /api/insurance/policies/:id
    // This endpoint should delete an insurance policy by ID
    policies: state.policies.filter(policy => policy.id !== id)
  })),
  
  updatePolicy: (id, updates) => set((state) => ({
    // TODO: Replace with real endpoint: PUT /api/insurance/policies/:id
    // This endpoint should update an insurance policy by ID
    // Request body: partial policy data to update
    policies: state.policies.map(policy => 
      policy.id === id ? { ...policy, ...updates } : policy
    )
  })),
  
  addDocument: (policyId, document) => set((state) => ({
    // TODO: Replace with real endpoint: POST /api/insurance/policies/:id/documents
    // This endpoint should add a document to an insurance policy
    // Request body: document data or file upload
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
    // TODO: Replace with real endpoint: DELETE /api/insurance/policies/:id/documents/:documentId
    // This endpoint should remove a document from an insurance policy
    policies: state.policies.map(policy => 
      policy.id === policyId 
        ? {
            ...policy,
            documents: policy.documents?.filter((_, index) => index !== documentIndex)
          }
        : policy
    )
  })),

  // Computed properties
  get policyTypes() {
    const types = new Set<string>();
    get().policies.forEach(policy => types.add(policy.type));
    
    return Array.from(types).map(type => {
      let name = type.charAt(0).toUpperCase() + type.slice(1);
      if (type === "term-life" || type === "permanent-life") name = "Life";
      if (type === "homeowners" || type === "auto") name = "Property";
      return { id: type, name };
    });
  },
  
  get totalPremium() {
    return get().policies.reduce((sum, policy) => sum + policy.premium, 0);
  },
  
  get totalCoverage() {
    return get().policies.reduce((sum, policy) => {
      const coverage = policy.coverage || policy.coverageAmount || 0;
      return sum + coverage;
    }, 0);
  }
}));
