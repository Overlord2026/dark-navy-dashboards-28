
import { IAModel } from "./types";

// Sample IA model data
export const iaModels: IAModel[] = [
  {
    id: "1",
    name: "2006 Domestic Core Equity Strategy 1",
    type: "Strategy",
    targets: "100/0",
    created: "2023-06-15",
    updated: "2024-02-20",
    benchmark: "S&P 500",
    tags: ["equity", "domestic", "core"]
  },
  {
    id: "2",
    name: "Aggressive Growth Strategy SMH 100%",
    type: "Strategy",
    targets: "100/0",
    created: "2023-07-01",
    updated: "2024-01-15",
    benchmark: "NASDAQ 100",
    tags: ["aggressive", "growth", "technology"]
  },
  {
    id: "3",
    name: "Bitcoin ETF Core Sleeve",
    type: "Sleeve",
    targets: "N/A",
    created: "2024-01-10",
    updated: "2024-03-05",
    benchmark: "Bitcoin Price Index",
    tags: ["cryptocurrency", "digital assets", "alternative"]
  },
  {
    id: "4",
    name: "Domestic Aggressive 90 Equity / 10 FI",
    type: "Model",
    targets: "90/10",
    created: "2023-05-20",
    updated: "2024-02-10",
    benchmark: "S&P 500",
    tags: ["aggressive", "equity", "fixed income"]
  },
  {
    id: "5",
    name: "Domestic Conservative+ 65 Equity / 35 FI",
    type: "Model",
    targets: "65/35",
    created: "2023-04-15",
    updated: "2024-03-01",
    benchmark: "Blended Index",
    tags: ["conservative", "balanced"]
  },
  {
    id: "6",
    name: "Domestic Equity Bit10 SMH10",
    type: "Model",
    targets: "80/20",
    created: "2023-09-01",
    updated: "2024-02-25",
    benchmark: "Custom Blend",
    tags: ["balanced", "digital", "equity"]
  },
  {
    id: "7",
    name: "Domestic Growth 80 Equity / 20 FI",
    type: "Model",
    targets: "80/20",
    created: "2023-03-10",
    updated: "2024-01-20",
    benchmark: "Russell 1000 Growth",
    tags: ["growth", "domestic", "balanced"]
  },
  {
    id: "8",
    name: "Domestic Moderate 70 Equity / 30 FI",
    type: "Model",
    targets: "70/30",
    created: "2023-02-05",
    updated: "2024-03-10",
    benchmark: "Blended Index",
    tags: ["moderate", "balanced"]
  },
  {
    id: "9",
    name: "Global Aggressive 90 Equity / 10 FI",
    type: "Model",
    targets: "90/10",
    created: "2023-08-12",
    updated: "2024-02-15",
    benchmark: "MSCI World Index",
    tags: ["global", "aggressive", "growth"]
  },
  {
    id: "10",
    name: "Global Growth 80 Equity / 20 FI",
    type: "Model",
    targets: "80/20",
    created: "2023-07-25",
    updated: "2024-01-30",
    benchmark: "MSCI ACWI",
    tags: ["global", "growth", "balanced"]
  },
  {
    id: "11",
    name: "Global Moderate 70 Equity / 30 FI",
    type: "Model",
    targets: "70/30",
    created: "2023-06-30",
    updated: "2024-02-28",
    benchmark: "MSCI World Blend",
    tags: ["global", "moderate", "balanced"]
  },
  {
    id: "12",
    name: "Income 1 Sleeve",
    type: "Sleeve",
    targets: "20/80",
    created: "2023-05-15",
    updated: "2024-03-12",
    benchmark: "Bloomberg Aggregate Bond",
    tags: ["income", "fixed income", "conservative"]
  },
  {
    id: "13",
    name: "Income Conservative 2 Sleeve",
    type: "Sleeve",
    targets: "10/90",
    created: "2023-04-20",
    updated: "2024-02-05",
    benchmark: "Bloomberg US Treasury",
    tags: ["income", "conservative", "treasury"]
  },
  {
    id: "14",
    name: "Tactical Fixed Income Sleeve 1",
    type: "Sleeve",
    targets: "0/100",
    created: "2023-09-10",
    updated: "2024-01-25",
    benchmark: "Bloomberg US Corporate",
    tags: ["tactical", "fixed income", "corporate"]
  }
];
