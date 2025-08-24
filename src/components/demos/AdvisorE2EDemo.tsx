import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { E2EDemoStepper, E2EDemo } from './E2EDemoStepper';
import seedLeads from '@/tools/seeds/leads';
import seedOnboarding from '@/tools/seeds/onboarding';
import seedRoadmap from '@/tools/seeds/roadmap';
import seedProposalReport from '@/tools/seeds/proposal-report';
import seedSupervisorDashboard from '@/tools/seeds/supervisor-dashboard';

const advisorDemo: E2EDemo = {
  id: 'advisor-practice',
  title: '90-Second Advisor Demo',
  description: 'Experience the complete advisor workflow from lead generation to compliance oversight.',
  steps: [
    {
      id: 'add-lead',
      title: 'Add Lead',
      description: 'Capture new prospect information and track pipeline status',
      toolKey: 'leads',
      route: '/advisor/leads',
      seedFunction: async () => { await seedLeads(); },
      duration: 6
    },
    {
      id: 'onboard-client',
      title: 'Client Onboarding',
      description: 'Complete intake process with document collection and verification',
      toolKey: 'onboarding',
      route: '/advisor/onboarding',
      seedFunction: async () => { await seedOnboarding(); },
      duration: 8
    },
    {
      id: 'create-roadmap',
      title: 'Financial Roadmap',
      description: 'Generate comprehensive financial plan with scenario modeling',
      toolKey: 'roadmap',
      route: '/advisor/roadmap',
      seedFunction: async () => { await seedRoadmap(); },
      duration: 10
    },
    {
      id: 'proposal-report',
      title: 'Proposal & Report',
      description: 'Create client-ready proposal with investment recommendations',
      toolKey: 'proposal-report',
      route: '/advisor/proposals',
      seedFunction: async () => { await seedProposalReport(); },
      duration: 8
    },
    {
      id: 'supervisor-export',
      title: 'Compliance Export',
      description: 'Generate compliance pack for supervisory review',
      toolKey: 'supervisor-dashboard',
      route: '/advisor/supervision',
      seedFunction: async () => { await seedSupervisorDashboard(); },
      duration: 5
    }
  ],
  finalRoute: '/advisor/receipts'
};

interface AdvisorE2EDemoProps {
  className?: string;
}

export const AdvisorE2EDemo: React.FC<AdvisorE2EDemoProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStart = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleComplete = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleStart}
        className={`focus-visible:ring-2 focus-visible:ring-cyan-400 ${className}`}
        size="lg"
      >
        <Play className="w-5 h-5 mr-2" />
        Play 90-second Advisor Demo
      </Button>

      <E2EDemoStepper
        demo={advisorDemo}
        isOpen={isOpen}
        onClose={handleClose}
        onComplete={handleComplete}
      />
    </>
  );
};