export type UUID = string;

export interface RiskWeights {
  mdd: number; 
  tuw: number; 
  ulcer: number; 
  sortino: number; 
  cvar5: number; 
  vol: number;
}

export interface RiskSubmetrics {
  mdd: number; 
  tuw_days: number; 
  ulcer: number; 
  sortino: number; 
  cvar5: number; 
  vol_annualized: number;
}

export interface RdiScore {
  fund_id: UUID;
  window_start: string; // ISO date
  window_end: string;
  drawdown_fund: number;
  drawdown_proxy: number;
  rdi: number;
  reason_codes: string[];
}

export interface RacScore {
  fund_id: UUID;
  window_start: string;
  window_end: string;
  rac: number;
  weights: RiskWeights;
  submetrics: RiskSubmetrics;
  reason_codes: string[];
  breach_flags?: string[];
}