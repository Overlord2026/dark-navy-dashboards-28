import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { E2EDemoStepper, E2EDemo } from './E2EDemoStepper';
import { seedAdvisorWorkspace } from '@/tools/seeds/advisor-workspace';

const advisorWorkflowDemo: E2EDemo = {
  id: 'advisor-workflow',
  title: '90-Second Advisor Workflow Demo',
  description: 'Experience the complete advisor process from lead qualification to supervisor review.',
  steps: [
    {
      id: 'leads-management',
      title: 'Lead Management',
      description: 'Review and qualify new prospects in the pipeline',
      toolKey: 'leads-management',
      route: '/advisor/leads',
      seedFunction: async () => { 
        const data = await seedAdvisorWorkspace();
        // Focus on leads aspect
        console.log('✅ Loaded', data.leads.length, 'demo leads');
      },
      duration: 15
    },
    {
      id: 'client-onboarding',
      title: 'Client Onboarding',
      description: 'Complete comprehensive client data collection and risk assessment',
      toolKey: 'client-onboarding',
      route: '/advisor/onboarding',
      seedFunction: async () => {
        // Data already seeded, just show relevant proof slip
        const { recordReceipt } = await import('@/features/receipts/record');
        recordReceipt({
          id: `onboard_step_${Date.now()}`,
          type: 'Decision-RDS',
          policy_version: 'E-2025.08',
          inputs_hash: 'sha256:demo',
          result: 'approve',
          reasons: ['ONBOARD_STEP_COMPLETE'],
          created_at: new Date().toISOString()
        } as any);
      },
      duration: 20
    },
    {
      id: 'roadmap-creation',
      title: 'Strategic Roadmap',
      description: 'Develop phased wealth management strategy',
      toolKey: 'roadmap-creation',
      route: '/advisor/roadmap',
      seedFunction: async () => {
        const { recordReceipt } = await import('@/features/receipts/record');
        recordReceipt({
          id: `roadmap_update_${Date.now()}`,
          type: 'Decision-RDS',
          policy_version: 'E-2025.08',
          inputs_hash: 'sha256:demo',
          result: 'approve',
          reasons: ['ROADMAP_UPDATED'],
          created_at: new Date().toISOString()
        } as any);
      },
      duration: 25
    },
    {
      id: 'proposal-generation',
      title: 'Proposal & Report',
      description: 'Generate comprehensive investment proposal and client report',
      toolKey: 'proposal-generation',
      route: '/advisor/proposals',
      seedFunction: async () => {
        const { recordReceipt } = await import('@/features/receipts/record');
        recordReceipt({
          id: `proposal_export_${Date.now()}`,
          type: 'Decision-RDS',
          policy_version: 'E-2025.08',
          inputs_hash: 'sha256:demo',
          result: 'approve',
          reasons: ['PROPOSAL_EXPORTED'],
          created_at: new Date().toISOString()
        } as any);
      },
      duration: 20
    },
    {
      id: 'supervisor-review',
      title: 'Engagement Tracker & Supervision',
      description: 'Track client engagement and supervisor approval workflow',
      toolKey: 'supervisor-review',
      route: '/advisor/supervision',
      seedFunction: async () => {
        const { recordReceipt } = await import('@/features/receipts/record');
        recordReceipt({
          id: `supervisor_approval_${Date.now()}`,
          type: 'Decision-RDS',
          policy_version: 'E-2025.08',
          inputs_hash: 'sha256:demo',
          result: 'approve',
          reasons: ['SUPERVISOR_APPROVED'],
          created_at: new Date().toISOString()
        } as any);
      },
      duration: 10
    }
  ],
  finalRoute: '/advisor/dashboard'
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
        demo={advisorWorkflowDemo}
        isOpen={isOpen}
        onClose={handleClose}
        onComplete={handleComplete}
      />
    </>
  );
};