
import React from "react";
import { BarChart, PiggyBank, LineChart, Briefcase, TrendingUp, Home } from "lucide-react";
import { LoanContentTemplate } from "./LoanContentTemplate";

export const SecuritiesBasedLoansContent = () => {
  const howItWorksFeatures = [
    {
      icon: BarChart,
      title: "Maintain Market Exposure",
      description: "Keep your investments working for you",
      colorClass: "bg-blue-50"
    },
    {
      icon: PiggyBank,
      title: "Competitive Rates",
      description: "Often lower than traditional loans",
      colorClass: "bg-green-50"
    },
    {
      icon: LineChart,
      title: "Flexible Repayment",
      description: "Pay interest only or principal + interest",
      colorClass: "bg-purple-50"
    }
  ];

  const useCaseFeatures = [
    {
      icon: Briefcase,
      title: "Bridge Financing",
      description: "Short-term needs with timing flexibility",
      colorClass: "bg-amber-50"
    },
    {
      icon: TrendingUp,
      title: "Investment Opportunities",
      description: "Leverage your portfolio for new investments",
      colorClass: "bg-blue-50"
    },
    {
      icon: Home,
      title: "Real Estate Purchases",
      description: "Down payments or full purchases",
      colorClass: "bg-green-50"
    }
  ];

  return (
    <LoanContentTemplate
      title="Securities-Based Loans"
      description="Using your investment portfolio as collateral for a line of credit."
      howItWorksFeatures={howItWorksFeatures}
      useCaseFeatures={useCaseFeatures}
      offeringName="Securities-Based Loans"
    />
  );
};
