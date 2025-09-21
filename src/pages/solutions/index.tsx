import React from 'react';
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
      <section className="relative overflow-hidden bg-bfo-navy text-bfo-ivory">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Wealth Solutions Marketplace
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/80">
              Discover and implement sophisticated wealth management solutions tailored to your needs
            </p>
          </div>
        </div>
      </section>

      <ToolsGrid
        tools={solutionTools}
        title="Solution Categories"
      />
    </div>
  );
}