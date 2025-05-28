
import React from "react";
import { InsuranceTypeCard } from "./InsuranceTypeCard";
import { InsuranceType } from "@/types/insuranceProvider";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface InsuranceOverviewProps {
  onSelectType: (type: InsuranceType) => void;
}

export const InsuranceOverview = ({ onSelectType }: InsuranceOverviewProps) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";

  const insuranceTypes = [
    {
      type: "term-life" as InsuranceType,
      title: "Term Life",
      description: "Affordable policies to protect your loved ones for a set term, usually between 10 and 30 years."
    },
    {
      type: "permanent-life" as InsuranceType,
      title: "Permanent Life",
      description: "Policies with lifelong coverage and the opportunity to build cash value, which accumulates on a tax-deferred basis."
    },
    {
      type: "annuities" as InsuranceType,
      title: "Annuities",
      description: "Insurance contracts used for asset accumulation or as income replacement with a stream of payments for a specified period or the rest of your life."
    },
    {
      type: "fiduciary-annuities" as InsuranceType,
      title: "Fiduciary Friendly Annuities",
      description: "Low-cost, transparent annuity solutions designed specifically for fiduciary advisors with no commissions and client-centric features."
    },
    {
      type: "long-term-care" as InsuranceType,
      title: "Long-Term Care",
      description: "Policies to cover the costs of care related to aging or disability. Helps protect your savings and get you access to better quality care."
    },
    {
      type: "healthcare" as InsuranceType,
      title: "Healthcare",
      description: "Comprehensive health insurance plans to cover medical expenses, doctor visits, hospital stays, and prescription medications."
    },
    {
      type: "homeowners" as InsuranceType,
      title: "Homeowners Insurance",
      description: "Protection for your home and personal property against damage, theft, and liability for injuries and property damage."
    },
    {
      type: "automobile" as InsuranceType,
      title: "Automobile Insurance",
      description: "Coverage for financial protection against physical damage or bodily injury resulting from traffic collisions and against liability."
    },
    {
      type: "umbrella" as InsuranceType,
      title: "Umbrella Policies",
      description: "Additional liability insurance that provides protection beyond existing limits and coverages of your homeowners, auto, and boat insurance policies."
    }
  ];

  return (
    <div className={cn(
      "animate-fade-in min-h-screen p-4",
      isLightTheme ? "bg-background text-foreground" : "bg-background text-foreground"
    )}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {insuranceTypes.map((insurance) => (
          <InsuranceTypeCard
            key={insurance.type}
            type={insurance.type}
            title={insurance.title}
            description={insurance.description}
            onClick={() => onSelectType(insurance.type)}
          />
        ))}
      </div>
    </div>
  );
};
