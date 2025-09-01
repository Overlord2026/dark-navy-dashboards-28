import React from 'react';
import { Hero } from '@/components/landing/Hero';
import { ToolsGrid } from '@/components/landing/ToolsGrid';
import { Users, FileText, Shield, TrendingUp, Calendar, Building } from 'lucide-react';

const prosTools = [
  {
    title: "Client Portal",
    description: "Secure client communication and document sharing",
    icon: Users,
    href: "/pros/client-portal"
  },
  {
    title: "Compliance Dashboard",
    description: "Stay compliant with automated tracking and reporting",
    icon: Shield,
    href: "/pros/compliance"
  },
  {
    title: "Document Vault",
    description: "Professional document management and workflow",
    icon: FileText,
    href: "/pros/documents"
  },
  {
    title: "Practice Analytics",
    description: "Insights and metrics to grow your practice",
    icon: TrendingUp,
    href: "/pros/analytics"
  },
  {
    title: "Client Meetings",
    description: "Schedule and manage client interactions",
    icon: Calendar,
    href: "/pros/meetings"
  },
  {
    title: "Business Development",
    description: "Tools to expand and enhance your practice",
    icon: Building,
    href: "/pros/business-development"
  }
];

export default function ProsIndex() {
  const handleDemoClick = () => {
    // TODO: Implement demo modal or redirect
    console.log('Demo clicked');
  };

  return (
    <div className="min-h-screen">
      <Hero
        title="Professional Suite"
        subtitle="Comprehensive tools for financial advisors, CPAs, attorneys, and insurance professionals to grow and manage their practice"
        onCtaClick={handleDemoClick}
      />
      <ToolsGrid tools={prosTools} title="Professional Tools" />
    </div>
  );
}