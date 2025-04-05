
import React from "react";
import { CreditCard, Gem, BadgeCheck, Home, GraduationCap, Car } from "lucide-react";
import { LoanContentTemplate } from "./LoanContentTemplate";

export const PersonalLoansContent = () => {
  const howItWorksFeatures = [
    {
      icon: CreditCard,
      title: "Fixed Payments",
      description: "Predictable monthly installments",
      colorClass: "bg-blue-50"
    },
    {
      icon: Gem,
      title: "Competitive Rates",
      description: "Based on your financial profile",
      colorClass: "bg-green-50"
    },
    {
      icon: BadgeCheck,
      title: "Quick Approvals",
      description: "Fast decision and funding process",
      colorClass: "bg-purple-50"
    }
  ];

  const useCaseFeatures = [
    {
      icon: Home,
      title: "Home Improvements",
      description: "Renovations and upgrades",
      colorClass: "bg-amber-50"
    },
    {
      icon: GraduationCap,
      title: "Education Expenses",
      description: "Tuition and educational costs",
      colorClass: "bg-blue-50"
    },
    {
      icon: Car,
      title: "Vehicle Purchases",
      description: "New or used auto financing",
      colorClass: "bg-green-50"
    }
  ];

  return (
    <LoanContentTemplate
      title="Personal Loans"
      description="Unsecured loans for personal expenses and life goals."
      howItWorksFeatures={howItWorksFeatures}
      useCaseFeatures={useCaseFeatures}
      offeringName="Personal Loans"
    />
  );
};
