import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { E2EDemoStepper, E2EDemo } from './E2EDemoStepper';
import { ProPersona } from '@/features/pro/types';
import { loadCPAFixtures } from '@/fixtures/pro/cpa';
import { loadAttorneyFixtures } from '@/fixtures/pro/attorney';
import { loadInsuranceFixtures } from '@/fixtures/pro/insurance';
import { loadHealthcareFixtures } from '@/fixtures/pro/healthcare';
import { loadRealtorFixtures } from '@/fixtures/pro/realtor';
import { track } from '@/lib/analytics';

const personaConfig: Record<Exclude<ProPersona, 'advisor'>, {
  title: string;
  description: string;
  loadFixtures: () => Promise<any>;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    route: string;
    duration: number;
  }>;
}> = {
  cpa: {
    title: '90-Second CPA Workflow Demo',
    description: 'Experience the complete CPA process from lead qualification to tax planning follow-up.',
    loadFixtures: loadCPAFixtures,
    steps: [
      {
        id: 'cpa-lead-capture',
        title: 'Tax Lead Capture',
        description: 'Capture tax planning lead with proper consent',
        route: '/cpa/leads',
        duration: 15
      },
      {
        id: 'cpa-meeting-import',
        title: 'Planning Session Import',
        description: 'Import tax planning meeting with compliance tracking',
        route: '/cpa/meetings',
        duration: 20
      },
      {
        id: 'cpa-campaign-send',
        title: 'Tax Season Follow-up',
        description: 'Send personalized tax season preparation campaign',
        route: '/cpa/campaigns',
        duration: 15
      },
      {
        id: 'cpa-receipts-review',
        title: 'Compliance Receipts',
        description: 'Review all generated compliance receipts and proof',
        route: '/cpa/receipts',
        duration: 10
      }
    ]
  },
  attorney: {
    title: '90-Second Attorney Workflow Demo',
    description: 'Experience the complete estate planning process with privilege protection.',
    loadFixtures: loadAttorneyFixtures,
    steps: [
      {
        id: 'attorney-lead-capture',
        title: 'Estate Planning Lead',
        description: 'Capture estate planning lead with attorney-client notice',
        route: '/attorney/leads',
        duration: 15
      },
      {
        id: 'attorney-meeting-import',
        title: 'Privileged Consultation',
        description: 'Import consultation with privilege protection',
        route: '/attorney/meetings',
        duration: 20
      },
      {
        id: 'attorney-campaign-send',
        title: 'Trust Review Follow-up',
        description: 'Send will and trust review follow-up campaign',
        route: '/attorney/campaigns',
        duration: 15
      },
      {
        id: 'attorney-receipts-review',
        title: 'Compliance & Privilege',
        description: 'Review compliance receipts with privilege protection',
        route: '/attorney/receipts',
        duration: 10
      }
    ]
  },
  insurance: {
    title: '90-Second Insurance Workflow Demo',
    description: 'Experience the complete insurance needs analysis and suitability process.',
    loadFixtures: loadInsuranceFixtures,
    steps: [
      {
        id: 'insurance-lead-capture',
        title: 'Insurance Lead Capture',
        description: 'Capture insurance lead with licensing compliance',
        route: '/insurance/leads',
        duration: 15
      },
      {
        id: 'insurance-meeting-import',
        title: 'Needs Analysis Import',
        description: 'Import needs analysis meeting with suitability tracking',
        route: '/insurance/meetings',
        duration: 20
      },
      {
        id: 'insurance-campaign-send',
        title: 'Product Follow-up',
        description: 'Send state-compliant product information campaign',
        route: '/insurance/campaigns',
        duration: 15
      },
      {
        id: 'insurance-receipts-review',
        title: 'Suitability Receipts',
        description: 'Review suitability and compliance receipts',
        route: '/insurance/receipts',
        duration: 10
      }
    ]
  },
  healthcare: {
    title: '90-Second Healthcare Workflow Demo',
    description: 'Experience the complete wellness consultation process with HIPAA protection.',
    loadFixtures: loadHealthcareFixtures,
    steps: [
      {
        id: 'healthcare-lead-capture',
        title: 'Wellness Lead Capture',
        description: 'Capture wellness lead with HIPAA consent',
        route: '/healthcare/leads',
        duration: 15
      },
      {
        id: 'healthcare-meeting-import',
        title: 'Consultation Import',
        description: 'Import wellness consultation with HIPAA protection',
        route: '/healthcare/meetings',
        duration: 20
      },
      {
        id: 'healthcare-education-send',
        title: 'Education Follow-up',
        description: 'Send educational wellness content (education only)',
        route: '/healthcare/campaigns',
        duration: 15
      },
      {
        id: 'healthcare-receipts-review',
        title: 'HIPAA Compliance',
        description: 'Review HIPAA-compliant receipts and protection',
        route: '/healthcare/receipts',
        duration: 10
      }
    ]
  },
  realtor: {
    title: '90-Second Realtor Workflow Demo',
    description: 'Experience the complete real estate client process from lead to closing.',
    loadFixtures: loadRealtorFixtures,
    steps: [
      {
        id: 'realtor-lead-capture',
        title: 'Buyer Lead Capture',
        description: 'Capture first-time buyer lead with service consent',
        route: '/realtor/leads',
        duration: 15
      },
      {
        id: 'realtor-meeting-import',
        title: 'Consultation Import',
        description: 'Import buyer consultation with action planning',
        route: '/realtor/meetings',
        duration: 20
      },
      {
        id: 'realtor-campaign-send',
        title: 'Market Update Campaign',
        description: 'Send neighborhood report and market updates',
        route: '/realtor/campaigns',
        duration: 15
      },
      {
        id: 'realtor-receipts-review',
        title: 'Transaction Receipts',
        description: 'Review all transaction and compliance receipts',
        route: '/realtor/receipts',
        duration: 10
      }
    ]
  }
};

interface ProE2EDemoProps {
  persona: ProPersona;
  className?: string;
}

export const ProE2EDemo: React.FC<ProE2EDemoProps> = ({ persona, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const config = personaConfig[persona];

  const demo: E2EDemo = {
    id: `pro-${persona}`,
    title: config.title,
    description: config.description,
    steps: config.steps.map(step => ({
      ...step,
      toolKey: step.id,
      seedFunction: async () => {
        const fixtures = await config.loadFixtures();
        track('pro.demo.step', { 
          persona, 
          step: step.id,
          fixtures_loaded: Object.keys(fixtures).length 
        });
        console.log(`✅ ${persona.toUpperCase()} demo step completed:`, step.id);
      }
    })),
    finalRoute: `/${persona}/receipts`
  };

  const handleStart = () => {
    track('pro.demo.start', { persona });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleComplete = () => {
    track('pro.demo.complete', { persona });
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
        Play 90-second {persona.toUpperCase()} Demo
      </Button>

      <E2EDemoStepper
        demo={demo}
        isOpen={isOpen}
        onClose={handleClose}
        onComplete={handleComplete}
      />
    </>
  );
};