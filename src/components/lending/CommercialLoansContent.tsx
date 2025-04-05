
import React from "react";
import { Building, BarChart4, CreditCard, LineChart, TrendingUp } from "lucide-react";
import { LoanContentTemplate } from "./LoanContentTemplate";

export const CommercialLoansContent = () => {
  const howItWorksFeatures = [
    {
      icon: Building,
      title: "Business Growth",
      description: "Fuel expansion and scaling operations",
      colorClass: "bg-blue-50"
    },
    {
      icon: CreditCard,
      title: "Flexible Terms",
      description: "Tailored to business cash flow",
      colorClass: "bg-green-50"
    },
    {
      icon: BarChart4,
      title: "Strategic Financing",
      description: "Optimize your capital structure",
      colorClass: "bg-purple-50"
    }
  ];

  const useCaseFeatures = [
    {
      icon: Building,
      title: "Real Estate Acquisition",
      description: "Purchase or develop commercial property",
      colorClass: "bg-amber-50"
    },
    {
      icon: TrendingUp,
      title: "Equipment Financing",
      description: "Upgrade machinery and technology",
      colorClass: "bg-blue-50"
    },
    {
      icon: LineChart,
      title: "Working Capital",
      description: "Manage cash flow and operations",
      colorClass: "bg-green-50"
    }
  ];

  return (
    <LoanContentTemplate
      title="Commercial Loans"
      description="Financing for business expenses and growth opportunities."
      howItWorksFeatures={howItWorksFeatures}
      useCaseFeatures={useCaseFeatures}
      offeringName="Commercial Loans"
    />
  );
};
