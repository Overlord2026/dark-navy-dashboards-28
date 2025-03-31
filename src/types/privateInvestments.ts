
export interface InvestmentStrategy {
  name: string;
  description: string;
  assetClass: string;
  minimumInvestment: string;
  lockupPeriod: string;
  expectedReturns?: string;
  benchmarks?: string[];
}

export interface PrivateInvestmentFirm {
  id: string;
  name: string;
  logo: string;
  description: string;
  founded: string;
  headquarters: string;
  aum: string; // Assets under management
  websiteUrl: string;
  specialties: string[];
  categories: string[];
  investorQualifications: string[];
  partnershipDetails: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    contactPerson?: string;
  };
  strategies: InvestmentStrategy[];
  performanceHighlights?: string[];
}
