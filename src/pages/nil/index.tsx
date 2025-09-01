import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { ToolsGrid } from '@/components/landing/ToolsGrid';
import { Calculator, Building, FileText, DollarSign, Shield, TrendingUp } from 'lucide-react';

const nilTools = [
  {
    title: "NIL Valuation Calculator",
    description: "Estimate your name, image, and likeness value",
    icon: Calculator,
    href: "/nil/calculator"
  },
  {
    title: "Brand Builder",
    description: "Build and manage your personal brand",
    icon: Building,
    href: "/nil/brand-builder"
  },
  {
    title: "Contract Templates",
    description: "Professional NIL contract templates and guidance",
    icon: FileText,
    href: "/nil/contracts",
    comingSoon: true
  },
  {
    title: "Tax Planning",
    description: "Navigate NIL income tax implications",
    icon: DollarSign,
    href: "/nil/tax",
    comingSoon: true
  },
  {
    title: "Compliance Hub",
    description: "Stay compliant with NCAA and school regulations",
    icon: Shield,
    href: "/nil/compliance",
    comingSoon: true
  },
  {
    title: "Investment Guide",
    description: "Smart investing strategies for NIL earnings",
    icon: TrendingUp,
    href: "/nil/investing",
    comingSoon: true
  }
];

export default function NILIndex() {
  const handleDemoClick = () => {
    // TODO: Implement demo modal or redirect
    console.log('Demo clicked');
  };

  return (
    <div className="min-h-screen">
      <Hero
        title="NIL Athlete Center"
        subtitle="Navigate name, image, and likeness opportunities with professional-grade tools designed for college athletes"
        onCtaClick={handleDemoClick}
      />
      <ToolsGrid tools={nilTools} />
    </div>
  );
}