
export interface PortfolioModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  returnRate: string;
  riskLevel: string;
  badge: {
    text: string;
    color: string;
  };
  assetClass?: string;
  strategy?: string;
  fees?: string;
}

export const portfolioModels: PortfolioModel[] = [
  {
    id: "income-focus",
    name: "Income Focus",
    provider: "Dimensional Fund Advisors",
    description: "Prioritizes stable income with lower volatility",
    returnRate: "+5.8%",
    riskLevel: "Low",
    badge: {
      text: "Conservative",
      color: "blue"
    },
    assetClass: "Fixed Income",
    strategy: "Income",
    fees: "0.35%"
  },
  {
    id: "growth-income",
    name: "Growth & Income",
    provider: "BlackRock",
    description: "Balance between growth and stable income",
    returnRate: "+8.2%",
    riskLevel: "Medium",
    badge: {
      text: "Balanced",
      color: "indigo"
    },
    assetClass: "Multi-Asset",
    strategy: "Balanced",
    fees: "0.45%"
  },
  {
    id: "maximum-growth",
    name: "Maximum Growth",
    provider: "Vanguard",
    description: "Focus on long-term capital appreciation",
    returnRate: "+12.5%",
    riskLevel: "High",
    badge: {
      text: "Aggressive",
      color: "purple"
    },
    assetClass: "Equity",
    strategy: "Growth",
    fees: "0.40%"
  },
  {
    id: "sustainable-future",
    name: "Sustainable Future",
    provider: "Alpha Architect",
    description: "ESG-focused investments with positive impact",
    returnRate: "+9.6%",
    riskLevel: "Medium",
    badge: {
      text: "ESG",
      color: "emerald"
    },
    assetClass: "Multi-Asset",
    strategy: "Sustainable",
    fees: "0.55%"
  },
  {
    id: "dynamic-allocation",
    name: "Dynamic Allocation",
    provider: "Boutique Family Office",
    description: "Active management with tactical shifts",
    returnRate: "+10.3%",
    riskLevel: "Medium-High",
    badge: {
      text: "Tactical",
      color: "amber"
    },
    assetClass: "Multi-Asset",
    strategy: "Tactical",
    fees: "0.60%"
  },
  {
    id: "international-focus",
    name: "International Focus",
    provider: "BlackRock",
    description: "Diversified exposure to global markets",
    returnRate: "+7.8%",
    riskLevel: "Medium",
    badge: {
      text: "Global",
      color: "red"
    },
    assetClass: "Equity",
    strategy: "International",
    fees: "0.50%"
  },
  {
    id: "emerging-markets",
    name: "Emerging Markets",
    provider: "Dimensional Fund Advisors",
    description: "Focused exposure to emerging market equities",
    returnRate: "+11.2%",
    riskLevel: "High",
    badge: {
      text: "Specialized",
      color: "orange"
    },
    assetClass: "Equity",
    strategy: "Specialized",
    fees: "0.65%"
  },
  {
    id: "technology-sector",
    name: "Technology Sector",
    provider: "Vanguard",
    description: "Concentrated portfolio of technology companies",
    returnRate: "+15.7%",
    riskLevel: "High",
    badge: {
      text: "Sector",
      color: "violet"
    },
    assetClass: "Equity",
    strategy: "Sector",
    fees: "0.42%"
  },
  {
    id: "bond-aggregate",
    name: "Bond Aggregate",
    provider: "BlackRock",
    description: "Diversified fixed income exposure across sectors",
    returnRate: "+3.9%",
    riskLevel: "Low",
    badge: {
      text: "Conservative",
      color: "blue"
    },
    assetClass: "Fixed Income",
    strategy: "Core",
    fees: "0.25%"
  },
  {
    id: "high-yield-credit",
    name: "High Yield Credit",
    provider: "Alpha Architect",
    description: "Higher income potential with credit risk",
    returnRate: "+7.2%",
    riskLevel: "Medium-High",
    badge: {
      text: "Income",
      color: "yellow"
    },
    assetClass: "Fixed Income",
    strategy: "Income",
    fees: "0.55%"
  },
  {
    id: "global-allocation",
    name: "Global Allocation",
    provider: "Boutique Family Office",
    description: "Globally diversified multi-asset portfolio",
    returnRate: "+9.1%",
    riskLevel: "Medium",
    badge: {
      text: "Global",
      color: "red"
    },
    assetClass: "Multi-Asset",
    strategy: "Global",
    fees: "0.58%"
  },
  {
    id: "tax-efficient",
    name: "Tax-Efficient Growth",
    provider: "Vanguard",
    description: "Tax-optimized portfolio for taxable accounts",
    returnRate: "+8.6%",
    riskLevel: "Medium",
    badge: {
      text: "Tax-Efficient",
      color: "green"
    },
    assetClass: "Multi-Asset",
    strategy: "Tax-Efficient",
    fees: "0.38%"
  }
];
