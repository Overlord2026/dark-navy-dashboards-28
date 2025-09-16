import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { ToolsGrid } from '@/components/landing/ToolsGrid';
import { Trophy, Users, FileText, DollarSign, Calendar, Shield } from 'lucide-react';

const nilTools = [
  {
    title: 'Deal Marketplace',
    description: 'Connect with brands and opportunities that match your profile',
    icon: Trophy,
    href: '/nil/marketplace'
  },
  {
    title: 'Agent Network',
    description: 'Find and connect with verified NIL agents and advisors',
    icon: Users,
    href: '/nil/agents'
  },
  {
    title: 'Contract Review',
    description: 'Professional review and guidance for NIL agreements',
    icon: FileText,
    href: '/nil/contracts'
  },
  {
    title: 'Earnings Tracker',
    description: 'Track and optimize your NIL earnings and opportunities',
    icon: DollarSign,
    href: '/nil/earnings'
  },
  {
    title: 'Schedule Manager',
    description: 'Coordinate NIL activities with academic and athletic commitments',
    icon: Calendar,
    href: '/nil/schedule'
  },
  {
    title: 'Compliance Helper',
    description: 'Stay compliant with NCAA and school NIL regulations',
    icon: Shield,
    href: '/nil/compliance'
  }
];

export default function NILIndex() {
  const handleDemoClick = () => {
    // Placeholder for demo functionality
    console.log('Starting NIL demo');
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--bfo-black))]">
      <Hero
        title="NIL Opportunities Platform"
        subtitle="Navigate Name, Image, and Likeness opportunities with confidence and compliance"
        onCtaClick={handleDemoClick}
      />

      <ToolsGrid
        tools={nilTools}
        title="NIL Management Tools"
        luxuryTheme={true}
      />
    </div>
  );
}