import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { ToolsGrid } from '@/components/landing/ToolsGrid';
import { Lightbulb, TrendingUp, Shield, Building, Zap, Users } from 'lucide-react';

const solutionTools = [
  {
    title: 'Investment Solutions',
    description: 'Curated investment opportunities and portfolio strategies',
    icon: TrendingUp,
    href: '/solutions/investments'
  },
  {
    title: 'Risk Management',
    description: 'Comprehensive risk assessment and mitigation strategies',
    icon: Shield,
    href: '/solutions/risk'
  },
  {
    title: 'Estate Planning',
    description: 'Advanced estate planning strategies and structures',
    icon: Building,
    href: '/solutions/estate'
  },
  {
    title: 'Tax Strategies',
    description: 'Sophisticated tax planning and optimization solutions',
    icon: Zap,
    href: '/solutions/tax'
  },
  {
    title: 'Family Governance',
    description: 'Structure and manage multi-generational family wealth',
    icon: Users,
    href: '/solutions/governance'
  },
  {
    title: 'Innovation Lab',
    description: 'Cutting-edge financial technology and strategies',
    icon: Lightbulb,
    href: '/solutions/innovation'
  }
];

export default function SolutionsIndex() {
  const handleDemoClick = () => {
    // Placeholder for demo functionality
    console.log('Starting solutions demo');
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
      <Hero
        title="Wealth Solutions Marketplace"
        subtitle="Discover and implement sophisticated wealth management solutions tailored to your needs"
        onCtaClick={handleDemoClick}
      />

      <ToolsGrid
        tools={solutionTools}
        title="Solution Categories"
      />
    </div>
  );
}