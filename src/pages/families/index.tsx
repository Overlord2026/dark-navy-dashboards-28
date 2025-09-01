import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { ToolsGrid } from '@/components/landing/ToolsGrid';
import { PersonaSubHeader } from '@/components/layout/PersonaSubHeader';
import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Shield, FileText, Users, Zap } from 'lucide-react';

const familyTools = [
  {
    title: 'Retirement Calculator',
    description: 'Plan your retirement with comprehensive financial modeling',
    icon: Calculator,
    href: '/tools/retirement-calculator'
  },
  {
    title: 'Investment Portfolio',
    description: 'Track and optimize your family investment portfolio',
    icon: TrendingUp,
    href: '/tools/portfolio'
  },
  {
    title: 'Estate Planning',
    description: 'Protect your legacy with comprehensive estate planning tools',
    icon: Shield,
    href: '/tools/estate'
  },
  {
    title: 'Document Center',
    description: 'Secure storage for all your important family documents',
    icon: FileText,
    href: '/tools/documents'
  },
  {
    title: 'Family Meetings',
    description: 'Organize and track family governance and decision-making',
    icon: Users,
    href: '/tools/meetings'
  },
  {
    title: 'Tax Planning',
    description: 'Optimize your tax strategy with professional-grade tools',
    icon: Zap,
    href: '/tools/tax-planning'
  }
];

export default function FamiliesIndex() {
  const handleDemoClick = () => {
    // Placeholder for demo functionality
    console.log('Starting family demo');
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
      <PersonaSubHeader>
        <div className="flex items-center gap-6">
          <Link to="/families/retirees" className="text-[#FFD700] hover:text-white transition-colors">
            Retirees
          </Link>
          <Link to="/families/aspiring" className="text-white hover:text-[#FFD700] transition-colors">
            Aspiring
          </Link>
        </div>
      </PersonaSubHeader>

      <Hero
        title="Family Wealth Management"
        subtitle="Comprehensive tools and strategies to protect and grow your family's wealth across generations"
        onCtaClick={handleDemoClick}
      />

      <ToolsGrid
        tools={familyTools}
        title="Family-Focused Tools"
      />
    </div>
  );
}