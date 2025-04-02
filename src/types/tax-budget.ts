
export interface TaxBudget {
  id: string;
  year: number;
  owner: string;
  capitalGainsLimit: number;
  accounts: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HypotheticalScenario {
  id: string;
  name: string;
  owner: string;
  accounts: string[];
  portfolioModel: string;
  taxHorizon: number; // in years
  createdAt: string;
  updatedAt: string;
}

export interface CapitalGains {
  shortTerm: number;
  longTerm: number;
  total: number;
}

export interface TaxYearBudget {
  year: number;
  capitalGainsLimit: number;
  currentCapitalGains: number;
  realizedGains: CapitalGains;
}
