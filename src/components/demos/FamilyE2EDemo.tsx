import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { E2EDemoStepper, E2EDemo } from './E2EDemoStepper';
import seedSocialSecurity from '@/tools/seeds/social-security';
import seedRmdCheck from '@/tools/seeds/rmd-check';
import seedWealthVault from '@/tools/seeds/wealth-vault';

const familyRetireeDemo: E2EDemo = {
  id: 'family-retiree',
  title: '90-Second Retiree Demo',
  description: 'Experience the complete retiree workflow from Social Security optimization to document vault.',
  steps: [
    {
      id: 'social-security',
      title: 'Social Security Optimizer',
      description: 'Analyze optimal claiming strategies for maximum lifetime benefits',
      toolKey: 'social-security',
      route: '/family/social-security',
      seedFunction: seedSocialSecurity,
      duration: 8
    },
    {
      id: 'rmd-check',
      title: 'RMD Check',
      description: 'Calculate required minimum distributions and tax implications',
      toolKey: 'rmd-check', 
      route: '/family/rmd-check',
      seedFunction: seedRmdCheck,
      duration: 8
    },
    {
      id: 'annuity-review',
      title: 'Annuity Review',
      description: 'Review annuity options for guaranteed income streams',
      toolKey: 'annuity-review',
      route: '/solutions/annuities',
      seedFunction: async () => {
        // Seed annuity data
        const proofSlip = {
          id: crypto.randomUUID(),
          type: 'Decision-RDS',
          subtype: 'ANNUITY_REVIEW',
          timestamp: new Date().toISOString(),
          summary: 'Annuity options reviewed',
          details: { products: 3, income_projection: '$2,400/month' }
        };
        
        // Store in receipts
        const receipts = JSON.parse(localStorage.getItem('family_receipts') || '[]');
        receipts.unshift(proofSlip);
        localStorage.setItem('family_receipts', JSON.stringify(receipts));
      },
      duration: 8
    },
    {
      id: 'wealth-vault',
      title: 'Document Upload',
      description: 'Securely store important estate planning documents',
      toolKey: 'wealth-vault',
      route: '/family/vault',
      seedFunction: seedWealthVault,
      duration: 6
    }
  ],
  finalRoute: '/family/receipts'
};

interface FamilyE2EDemoProps {
  className?: string;
}

export const FamilyE2EDemo: React.FC<FamilyE2EDemoProps> = ({ className = '' }) => {
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
        Play 90-second Retiree Demo
      </Button>

      <E2EDemoStepper
        demo={familyRetireeDemo}
        isOpen={isOpen}
        onClose={handleClose}
        onComplete={handleComplete}
      />
    </>
  );
};