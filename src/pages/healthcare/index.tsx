import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { ToolsGrid } from '@/components/landing/ToolsGrid';
import { PiggyBank, Calculator, Shield, Wallet, FileText, TrendingUp } from 'lucide-react';

const healthcareTools = [
  {
    title: "HSA Optimizer",
    description: "Maximize your health savings account benefits",
    icon: PiggyBank,
    href: "/healthcare/hsa"
  },
  {
    title: "Healthcare Budgeting",
    description: "Plan and budget for medical expenses",
    icon: Calculator,
    href: "/healthcare/budgeting"
  },
  {
    title: "Insurance Analyzer",
    description: "Compare and optimize health insurance plans",
    icon: Shield,
    href: "/healthcare/insurance",
    comingSoon: true
  },
  {
    title: "FSA Calculator",
    description: "Plan your flexible spending account contributions",
    icon: Wallet,
    href: "/healthcare/fsa",
    comingSoon: true
  },
  {
    title: "Medical Records",
    description: "Secure storage and organization of health records",
    icon: FileText,
    href: "/healthcare/records",
    comingSoon: true
  },
  {
    title: "Retirement Healthcare",
    description: "Plan for healthcare costs in retirement",
    icon: TrendingUp,
    href: "/healthcare/retirement",
    comingSoon: true
  }
];

export function HealthcareIndex() {
  const handleDemoClick = () => {
    // TODO: Implement demo modal or redirect
    console.log('Demo clicked');
  };

  return (
    <div className="min-h-screen">
      <Hero
        title="Healthcare Financial Planning"
        subtitle="Comprehensive tools to manage healthcare costs and optimize your health-related financial decisions"
        onCtaClick={handleDemoClick}
      />
      <ToolsGrid tools={healthcareTools} />
    </div>
  );
}

// 👇 this fixes React.lazy + TypeScript
export default HealthcareIndex;