import { AuthorityGrant, BeneficiaryMismatch, BinderManifest } from './types';

export interface EstateStore {
  clientId: string;
  planMetadata: {
    state: string;
    hasTrust: boolean;
    spouseData?: any;
    guardians?: any[];
    trustees?: any[];
    beneficiaries?: any[];
  };
  beneficiaryIntents: Record<string, string>; // accountId -> intended beneficiary
  authorityGrants: AuthorityGrant[];
  documentRefs: Array<{
    id: string;
    type: 'will' | 'rlt' | 'poa' | 'pourover';
    vaultRef: string;
    createdAt: string;
  }>;
  binderHistory: Array<{
    id: string;
    manifest: BinderManifest;
    vaultRef: string;
    createdAt: string;
  }>;
}

const STORAGE_KEY = 'estate_workbench_store';

export function getEstateStore(clientId: string): EstateStore {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${clientId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load estate store:', error);
  }
  
  return {
    clientId,
    planMetadata: {
      state: 'CA',
      hasTrust: false
    },
    beneficiaryIntents: {},
    authorityGrants: [],
    documentRefs: [],
    binderHistory: []
  };
}

export function saveEstateStore(store: EstateStore): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${store.clientId}`, JSON.stringify(store));
  } catch (error) {
    console.error('Failed to save estate store:', error);
  }
}

export function updateEstateStore(clientId: string, updates: Partial<EstateStore>): EstateStore {
  const store = getEstateStore(clientId);
  const updated = { ...store, ...updates };
  saveEstateStore(updated);
  return updated;
}