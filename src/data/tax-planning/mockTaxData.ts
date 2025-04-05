
import { Save, FileBarChart, Wallet, Calculator } from "lucide-react";
import React from "react";

export const taxBracketData = {
  currentBracket: "32%",
  estimatedLiability: 146820,
  potentialSavings: 32450,
  yearOverYearChange: -8450
};

export interface TaxStrategy {
  id: string;
  title: string;
  description: string;
  impact: string;
  icon: string; // Icon name to be converted to component
  status: "implemented" | "recommended" | "in-progress";
}

export const taxStrategies = [
  {
    id: "max-retirement",
    title: "Maximize Retirement Contributions",
    description: "Increase 401(k) contributions to reduce taxable income",
    impact: "$8,700",
    icon: "Save",
    status: "implemented"
  },
  {
    id: "loss-harvest",
    title: "Tax Loss Harvesting",
    description: "Offset capital gains with strategic losses",
    impact: "$5,200",
    icon: "FileBarChart",
    status: "recommended"
  },
  {
    id: "charitable",
    title: "Charitable Giving",
    description: "Optimize charitable contributions for tax benefits",
    impact: "$4,800",
    icon: "Wallet",
    status: "in-progress"
  },
  {
    id: "business-expense",
    title: "Business Expense Review",
    description: "Comprehensive review of deductible business expenses",
    impact: "$13,750",
    icon: "Calculator",
    status: "recommended"
  }
];

export const taxDeadlines = [
  {
    id: "filing-deadline",
    date: "Apr 15, 2024",
    title: "Federal Income Tax Filing Deadline",
    description: "File your 2023 federal income tax return or request an extension",
    daysLeft: 10
  },
  {
    id: "q2-payment",
    date: "Jun 15, 2024",
    title: "Estimated Tax Payment (Q2)",
    description: "Second quarter estimated tax payment due",
    daysLeft: 71
  },
  {
    id: "q3-payment",
    date: "Sep 15, 2024",
    title: "Estimated Tax Payment (Q3)",
    description: "Third quarter estimated tax payment due",
    daysLeft: 163
  },
  {
    id: "tax-loss-deadline",
    date: "Dec 31, 2024",
    title: "Tax-Loss Harvesting Deadline",
    description: "Last day to realize investment losses for current tax year",
    daysLeft: 270
  }
];

export const deductionCategories = [
  {
    id: "business",
    category: "Business Expenses",
    amount: 38500,
    percentage: 28,
    color: "bg-blue-500"
  },
  {
    id: "retirement",
    category: "Retirement Contributions",
    amount: 22500,
    percentage: 16,
    color: "bg-green-500"
  },
  {
    id: "mortgage",
    category: "Mortgage Interest",
    amount: 19200,
    percentage: 14,
    color: "bg-purple-500"
  },
  {
    id: "charity",
    category: "Charitable Donations",
    amount: 12500,
    percentage: 9,
    color: "bg-amber-500"
  },
  {
    id: "medical",
    category: "Medical Expenses",
    amount: 8300,
    percentage: 6,
    color: "bg-red-500"
  },
  {
    id: "other",
    category: "Other Deductions",
    amount: 37500,
    percentage: 27,
    color: "bg-cyan-500"
  }
];

// Helper function to get icon component from string name
export const getIconComponent = (iconName: string): React.ReactNode => {
  switch (iconName) {
    case "Save":
      return <Save className="h-5 w-5 text-green-400" />;
    case "FileBarChart":
      return <FileBarChart className="h-5 w-5 text-blue-400" />;
    case "Wallet":
      return <Wallet className="h-5 w-5 text-purple-400" />;
    case "Calculator":
      return <Calculator className="h-5 w-5 text-amber-400" />;
    default:
      return <Calculator className="h-5 w-5" />;
  }
};
