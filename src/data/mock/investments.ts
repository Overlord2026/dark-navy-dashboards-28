
export interface PortfolioModel {
  id: string;
  name: string;
  type: "Model" | "Sleeve";
  allocation: string;
  benchmark: string;
  createdDate: string;
  updatedDate: string;
  tags: string[];
  performance: string;
  manager: string;
}

export interface InvestmentOffering {
  id: number;
  name: string;
  description: string;
  minimumInvestment: string;
  performance: string;
  lockupPeriod: string;
  lockUp?: string;
  firm: string;
  tags: string[];
  platform?: string;
  category?: string;
  investorQualification?: string;
  liquidity?: string;
  subscriptions?: string;
  strategy: {
    overview: string;
    approach: string;
    target: string;
    stage: string;
    geography: string;
    sectors: string[];
    expectedReturn: string;
    benchmarks: string[];
  };
}

export const mockPortfolioModels: PortfolioModel[] = [
  {
    id: "model1",
    name: "Domestic Core Equity Strategy",
    type: "Sleeve",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Aug 23, 2024",
    updatedDate: "7 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+15.2%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model2",
    name: "Aggressive Growth Strategy SMH",
    type: "Sleeve",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Jun 28, 2024",
    updatedDate: "9 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+22.7%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model3",
    name: "Bitcoin ETF Core Sleeve",
    type: "Sleeve",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Jun 7, 2024",
    updatedDate: "10 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+134.2%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model4",
    name: "Domestic Aggressive 90 Equity/ 10 FI",
    type: "Model",
    allocation: "90/10",
    benchmark: "SPY90AGG10",
    createdDate: "Apr 26, 2023",
    updatedDate: "Almost 2 Years Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+18.9%",
    manager: "Finiat"
  },
  {
    id: "model5",
    name: "Domestic Conservative+ 65 Equity / 35 FI",
    type: "Model",
    allocation: "65/35",
    benchmark: "SPY65AGG35",
    createdDate: "Apr 26, 2023",
    updatedDate: "Almost 2 Years Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+12.3%",
    manager: "Finiat"
  },
  {
    id: "model6",
    name: "Domestic Equity Bit10 SMH10",
    type: "Model",
    allocation: "100/0",
    benchmark: "SPDR S&P 500",
    createdDate: "Jun 28, 2024",
    updatedDate: "9 Months Ago",
    tags: ["Equity", "Blend", "Large"],
    performance: "+25.4%",
    manager: "Advanced Wealth Management"
  }
];

export const mockInvestmentOfferings: InvestmentOffering[] = [
  {
    id: 1,
    name: "Global Macro Fund",
    description: "A global macro fund that invests in a wide range of assets across global markets, seeking to profit from broad economic trends and changes in government policies.",
    minimumInvestment: "$250,000",
    performance: "+18.5% YTD",
    lockupPeriod: "2 Years",
    firm: "Bridgewater Associates",
    tags: ["Global", "Macro", "Multi-Strategy"],
    investorQualification: "Qualified Purchaser",
    liquidity: "Quarterly",
    subscriptions: "Monthly",
    strategy: {
      overview: "Our Global Macro Fund employs a top-down approach that seeks to profit from changes in global economies, typically brought about by shifts in government policy that impact interest rates, currency exchange rates, commodity prices, and stock prices.",
      approach: "The fund utilizes a systematic approach to identify macroeconomic trends and investment opportunities across various asset classes and geographic regions.",
      target: "12-15% annualized returns",
      stage: "All market conditions",
      geography: "Global with emphasis on developed markets",
      sectors: ["Fixed Income", "Currencies", "Equities", "Commodities"],
      expectedReturn: "12-15% annually",
      benchmarks: ["HFRX Macro/CTA Index", "S&P Global BMI"]
    }
  },
  {
    id: 2,
    name: "Technology Growth Fund",
    description: "A sector-focused fund investing primarily in high-growth technology companies across both public and private markets.",
    minimumInvestment: "$500,000",
    performance: "+25.7% YTD",
    lockupPeriod: "1 Year",
    firm: "Tiger Global Management",
    tags: ["Technology", "Growth", "Sector"],
    investorQualification: "Accredited Investor",
    liquidity: "Quarterly",
    subscriptions: "Monthly",
    strategy: {
      overview: "The Technology Growth Fund focuses on identifying and investing in companies with strong technological advantages and significant growth potential in rapidly expanding markets.",
      approach: "Combines fundamental research with industry expertise to identify high-potential companies at various stages of development.",
      target: "20%+ annualized returns",
      stage: "Growth and late-stage",
      geography: "Global with emphasis on US and Asia",
      sectors: ["Software", "Internet", "Fintech", "Enterprise Tech", "Consumer Tech"],
      expectedReturn: "20%+ annually",
      benchmarks: ["NASDAQ Composite", "S&P North American Technology Sector Index"]
    }
  }
];
