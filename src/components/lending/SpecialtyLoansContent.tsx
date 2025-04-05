
import React from "react";
import { Briefcase, Lightbulb, GraduationCap, Plane, Palette, Ship } from "lucide-react";
import { LoanContentTemplate } from "./LoanContentTemplate";

export const SpecialtyLoansContent = () => {
  const howItWorksFeatures = [
    {
      icon: Briefcase,
      title: "Tailored Solutions",
      description: "Financing designed for unique needs",
      colorClass: "bg-blue-50"
    },
    {
      icon: Lightbulb,
      title: "Expert Guidance",
      description: "Specialist lenders with industry knowledge",
      colorClass: "bg-green-50"
    },
    {
      icon: GraduationCap,
      title: "Specialized Terms",
      description: "Structured for specific assets or situations",
      colorClass: "bg-purple-50"
    }
  ];

  const useCaseFeatures = [
    {
      icon: Plane,
      title: "Aviation Financing",
      description: "Aircraft purchasing and maintenance",
      colorClass: "bg-amber-50"
    },
    {
      icon: Palette,
      title: "Art & Collectibles",
      description: "Financing for high-value collections",
      colorClass: "bg-blue-50"
    },
    {
      icon: Ship,
      title: "Marine Financing",
      description: "Yacht and vessel purchases",
      colorClass: "bg-green-50"
    }
  ];

  return (
    <LoanContentTemplate
      title="Specialty Loans"
      description="Specialized financing solutions for unique needs."
      howItWorksFeatures={howItWorksFeatures}
      useCaseFeatures={useCaseFeatures}
      offeringName="Specialty Loans"
    />
  );
};
