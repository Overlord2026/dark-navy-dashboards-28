
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
    name: "Domestic Equity Bit10 SMH10",
    type: "Model",
    allocation: "80/20",
    benchmark: "Custom Blend",
    createdDate: "Sep 1, 2023",
    updatedDate: "Feb 25, 2024",
    tags: ["balanced", "digital", "equity"],
    performance: "+15.2%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model2",
    name: "Domestic Growth 80 Equity / 20 FI",
    type: "Model",
    allocation: "80/20",
    benchmark: "Russell 1000 Growth",
    createdDate: "Mar 10, 2023",
    updatedDate: "Jan 20, 2024",
    tags: ["growth", "domestic", "balanced"],
    performance: "+22.7%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model3",
    name: "Domestic Moderate 70 Equity / 30 FI",
    type: "Model",
    allocation: "70/30",
    benchmark: "Blended Index",
    createdDate: "Feb 5, 2023",
    updatedDate: "Mar 10, 2024",
    tags: ["moderate", "balanced"],
    performance: "+18.9%",
    manager: "Finiat"
  },
  {
    id: "model4",
    name: "Global Aggressive 90 Equity / 10 FI",
    type: "Model",
    allocation: "90/10",
    benchmark: "MSCI World Index",
    createdDate: "Aug 12, 2023",
    updatedDate: "Feb 15, 2024",
    tags: ["global", "aggressive", "growth"],
    performance: "+25.4%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model5",
    name: "Global Growth 80 Equity / 20 FI",
    type: "Model",
    allocation: "80/20",
    benchmark: "MSCI ACWI",
    createdDate: "Jul 25, 2023",
    updatedDate: "Jan 30, 2024",
    tags: ["global", "growth", "balanced"],
    performance: "+19.8%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "model6",
    name: "Global Moderate 70 Equity / 30 FI",
    type: "Model",
    allocation: "70/30",
    benchmark: "MSCI World Blend",
    createdDate: "Jun 30, 2023",
    updatedDate: "Feb 28, 2024",
    tags: ["global", "moderate", "balanced"],
    performance: "+16.5%",
    manager: "Finiat"
  },
  {
    id: "sleeve1",
    name: "Income 1 Sleeve",
    type: "Sleeve",
    allocation: "20/80",
    benchmark: "Bloomberg Aggregate Bond",
    createdDate: "May 15, 2023",
    updatedDate: "Mar 12, 2024",
    tags: ["income", "fixed income", "conservative"],
    performance: "+5.8%",
    manager: "Advanced Wealth Management"
  },
  {
    id: "sleeve2",
    name: "Income Conservative 2 Sleeve",
    type: "Sleeve",
    allocation: "10/90",
    benchmark: "Bloomberg US Treasury",
    createdDate: "Apr 20, 2023",
    updatedDate: "Feb 5, 2024",
    tags: ["income", "conservative", "treasury"],
    performance: "+4.2%",
    manager: "Finiat"
  },
  {
    id: "sleeve3",
    name: "Tactical Fixed Income Sleeve 1",
    type: "Sleeve",
    allocation: "0/100",
    benchmark: "Bloomberg US Corporate",
    createdDate: "Sep 10, 2023",
    updatedDate: "Jan 25, 2024",
    tags: ["tactical", "fixed income", "corporate"],
    performance: "+6.1%",
    manager: "Advanced Wealth Management"
  }
];
