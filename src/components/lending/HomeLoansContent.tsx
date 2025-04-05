
import React from "react";
import { Home, Calculator, Clock } from "lucide-react";
import { LoanContentTemplate } from "./LoanContentTemplate";

export const HomeLoansContent = () => {
  const howItWorksFeatures = [
    {
      icon: Home,
      title: "Property Acquisition",
      description: "Financing for your dream home",
      colorClass: "bg-blue-50"
    },
    {
      icon: Calculator,
      title: "Flexible Terms",
      description: "Fixed and adjustable rate options",
      colorClass: "bg-green-50"
    },
    {
      icon: Clock,
      title: "Long-Term Financing",
      description: "15, 20, or 30-year terms available",
      colorClass: "bg-purple-50"
    }
  ];

  const useCaseFeatures = [
    {
      icon: Home,
      title: "First-Time Homebuyers",
      description: "Special programs and assistance",
      colorClass: "bg-amber-50"
    },
    {
      icon: Home,
      title: "Property Upgrades",
      description: "Refinancing for home improvements",
      colorClass: "bg-blue-50"
    },
    {
      icon: Home,
      title: "Vacation Properties",
      description: "Second home and investment financing",
      colorClass: "bg-green-50"
    }
  ];

  return (
    <LoanContentTemplate
      title="Home Loans"
      description="Mortgages and financing solutions for residential real estate."
      howItWorksFeatures={howItWorksFeatures}
      useCaseFeatures={useCaseFeatures}
      offeringName="Home Loans"
    />
  );
};
