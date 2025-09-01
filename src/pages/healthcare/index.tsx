import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { ToolsGrid } from '@/components/landing/ToolsGrid';
import { Heart, Calculator, FileText, Users, Shield, Activity } from 'lucide-react';

const healthcareTools = [
  {
    title: 'HSA Optimizer',
    description: 'Maximize your Health Savings Account benefits and tax advantages',
    icon: Heart,
    href: '/tools/hsa'
  },
  {
    title: 'Healthcare Calculator',
    description: 'Plan for healthcare costs in retirement and beyond',
    icon: Calculator,
    href: '/tools/healthcare-calc'
  },
  {
    title: 'Medical Records Vault',
    description: 'Secure storage and organization of health documents',
    icon: FileText,
    href: '/tools/medical-vault'
  },
  {
    title: 'Healthcare Directives',
    description: 'Create and manage advance healthcare directives',
    icon: Users,
    href: '/tools/directives'
  },
  {
    title: 'Insurance Navigator',
    description: 'Compare and optimize healthcare insurance options',
    icon: Shield,
    href: '/tools/insurance'
  },
  {
    title: 'Wellness Tracker',
    description: 'Monitor health metrics and preventive care schedules',
    icon: Activity,
    href: '/tools/wellness'
  }
];

export default function HealthcareIndex() {
  const handleDemoClick = () => {
    // Placeholder for demo functionality
    console.log('Starting healthcare demo');
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
      <Hero
        title="Healthcare Financial Planning"
        subtitle="Comprehensive tools to plan, manage, and optimize your healthcare financial strategy"
        onCtaClick={handleDemoClick}
      />

      <ToolsGrid
        tools={healthcareTools}
        title="Healthcare Planning Tools"
      />
    </div>
  );
}