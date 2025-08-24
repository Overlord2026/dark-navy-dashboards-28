import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { ReadyCheck } from './ReadyCheck';

interface ReadyBannerProps {
  persona?: 'family' | 'advisor' | 'cpa' | 'attorney' | 'insurance' | 'healthcare' | 'realtor';
  className?: string;
  onDismiss?: () => void;
}

export const ReadyBanner: React.FC<ReadyBannerProps> = ({
  persona = 'family',
  className = '',
  onDismiss
}) => {
  // Mock ready status - in real implementation, this would come from context/API
  const getReadyStatus = () => {
    // Simulate different states for demo
    const mockStatuses = {
      family: { ready: false, missing: ['vault_onboarded', 'disclosures_done'] },
      advisor: { ready: false, missing: ['e_o_insurance'] },
      cpa: { ready: false, missing: ['ce_requirements'] },
      attorney: { ready: false, missing: ['trust_account'] },
      insurance: { ready: true, missing: [] },
      healthcare: { ready: false, missing: ['cme_requirements'] },
      realtor: { ready: false, missing: ['ce_credits'] }
    };

    return mockStatuses[persona];
  };

  const status = getReadyStatus();

  // Don't show banner if already ready
  if (status.ready) {
    return null;
  }

  const handleFixAction = (itemId?: string) => {
    console.log('[Analytics] ready_banner.fix_action', { persona, itemId });
    
    // Navigate to appropriate fix page
    const fixUrls: Record<string, string> = {
      vault_onboarded: '/vault/setup',
      disclosures_done: '/disclosures',
      e_o_insurance: '/advisor/insurance',
      ce_requirements: '/cpa/ce',
      trust_account: '/attorney/trust',
      cme_requirements: '/healthcare/cme',
      ce_credits: '/realtor/ce'
    };

    if (itemId && fixUrls[itemId]) {
      window.location.href = fixUrls[itemId];
    } else {
      // Show detailed ready check
      const detailsEl = document.getElementById('ready-check-details');
      if (detailsEl) {
        detailsEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const getMissingItemsText = () => {
    const itemLabels: Record<string, string> = {
      vault_onboarded: 'Vault Setup',
      disclosures_done: 'Disclosures',
      e_o_insurance: 'E&O Insurance',
      ce_requirements: 'CE Requirements',
      trust_account: 'Trust Account',
      cme_requirements: 'CME Requirements',
      ce_credits: 'CE Credits'
    };

    return status.missing.map(item => itemLabels[item] || item).join(', ');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <strong>Setup Required:</strong> Complete {status.missing.length} item{status.missing.length > 1 ? 's' : ''} to unlock full functionality
              <div className="text-sm text-yellow-700 mt-1">
                Missing: {getMissingItemsText()}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFixAction()}
                className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
              >
                View Details
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
              {onDismiss && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={onDismiss}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* Detailed Ready Check (initially hidden) */}
      <div id="ready-check-details" className="hidden">
        <ReadyCheck 
          persona={persona} 
          onAction={handleFixAction}
        />
      </div>
    </div>
  );
};