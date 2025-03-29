
export type PropertyType = 'primary' | 'vacation' | 'rental' | 'business';
export type OwnershipType = 'single' | 'joint' | 'trust' | 'llc';

export interface Improvement {
  description: string;
  date: string;
  cost: number;
}

export interface RentalDetails {
  monthlyIncome: number;
  monthlyExpenses: number;
  occupiedSince?: string;
  leaseEnd?: string;
  tenantName?: string;
}

export interface BusinessDetails {
  companyName: string;
  usageType: string;
  annualExpenses: number;
}

export interface PropertyValuation {
  estimatedValue: number;
  lastUpdated: string;
  confidence: 'high' | 'medium' | 'low';
  source: string;
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  address: string;
  ownership: OwnershipType;
  owner: string;
  purchaseDate: string;
  originalCost: number;
  currentValue: number;
  improvements: Improvement[];
  rental?: RentalDetails;
  business?: BusinessDetails;
  notes?: string;
  valuation?: PropertyValuation;
}

export interface PropertyFormData {
  name: string;
  type: PropertyType;
  address: string;
  ownership: OwnershipType;
  owner: string;
  purchaseDate: string;
  originalCost: number;
  currentValue: number;
  improvements: Improvement[];
  rental?: RentalDetails;
  business?: BusinessDetails;
  notes?: string;
  id?: string;
  valuation?: PropertyValuation;
}
