export interface Scenario {
  id: string;
  householdId: string;
  name: string;
  createdAt: string;
  createdBy: string;
  assumptions: any;
  goals: any[];
  income_floor: any[];
  annuity_layers: any[];
  mcParams: { nSims: number; horizon: number };
  withdrawal_policy: { order: string[]; tax_rules?: any };
  notes?: string;
}

export interface Review {
  id: string;
  scenarioId: string;
  runAt: string;
  runBy: string;
  results: {
    successProb: number;
    mc_percentiles: Record<string, number>;
    income_bands: any[];
    tax_buckets: any;
    ending_values: any;
  };
  guardrails: {
    triggered: boolean;
    recommend?: {
      type: 'spend_up' | 'spend_down' | 'annuity' | 'delay_ss';
      amountPct?: number;
    };
  };
  diffs?: {
    fromScenarioId?: string;
    changed_keys: string[];
  };
  artifacts?: {
    csv_url?: string;
    pdf_url?: string;
  };
}