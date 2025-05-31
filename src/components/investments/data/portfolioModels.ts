
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

export const portfolioModels: PortfolioModel[] = [
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
