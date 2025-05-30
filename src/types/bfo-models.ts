
export interface ModelPortfolio {
  id: string;
  name: string;
  provider: string;
  description: string;
  return_rate: string;
  risk_level: string;
  badge_text: string;
  badge_color: string;
  asset_allocation: string;
  tax_status: string;
  series_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPortfolioAssignment {
  id: string;
  user_id: string;
  model_portfolio_id: string;
  assigned_accounts: number;
  trading_groups: number;
  assignment_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  model_portfolio: ModelPortfolio;
}

export interface BFOModelsFilter {
  provider?: string;
  series_type?: string;
  risk_level?: string;
  badge_text?: string;
}
