import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  User, 
  Shield, 
  FileText, 
  Vault,
  ExternalLink
} from 'lucide-react';

interface ReadyCheckItem {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'warning' | 'missing';
  actionText?: string;
  actionUrl?: string;
  required: boolean;
}

interface ReadyCheckProps {
  persona?: 'family' | 'advisor' | 'cpa' | 'attorney' | 'insurance' | 'healthcare' | 'realtor';
  clientName?: string;
  onAction?: (itemId: string) => void;
}

export const ReadyCheck: React.FC<ReadyCheckProps> = ({
  persona = 'family',
  clientName,
  onAction
}) => {
  const getPersonaChecks = (): ReadyCheckItem[] => {
    const baseChecks: ReadyCheckItem[] = [
      {
        id: 'profile_complete',
        title: 'Profile Complete',
        description: 'Basic profile information and preferences',
        status: 'complete',
        required: true
      },
      {
        id: 'consent_ok',
        title: 'Consent Recorded',
        description: 'Valid consent for data processing and communications',
        status: 'complete',
        required: true
      },
      {
        id: 'disclosures_done',
        title: 'Disclosures Acknowledged',
        description: 'Required legal and regulatory disclosures',
        status: 'warning',
        actionText: 'Review Disclosures',
        actionUrl: '/disclosures',
        required: true
      },
      {
        id: 'vault_onboarded',
        title: 'Vault Setup',
        description: 'Secure document storage configured',
        status: 'missing',
        actionText: 'Setup Vault',
        actionUrl: '/vault/setup',
        required: true
      },
      {
        id: 'policy_version',
        title: 'Policy Version',
        description: 'Current terms and privacy policy accepted',
        status: 'complete',
        required: true
      }
    ];

    // Add persona-specific checks
    switch (persona) {
      case 'advisor':
        return [
          ...baseChecks,
          {
            id: 'licenses_verified',
            title: 'Licenses Verified',
            description: 'Professional licenses and registrations confirmed',
            status: 'complete',
            required: true
          },
          {
            id: 'e_o_insurance',
            title: 'E&O Insurance',
            description: 'Errors and omissions insurance current',
            status: 'warning',
            actionText: 'Update Insurance',
            actionUrl: '/advisor/insurance',
            required: true
          }
        ];

      case 'cpa':
        return [
          ...baseChecks,
          {
            id: 'cpa_license',
            title: 'CPA License',
            description: 'Valid CPA license in practice states',
            status: 'complete',
            required: true
          },
          {
            id: 'ce_requirements',
            title: 'CE Requirements',
            description: 'Continuing education up to date',
            status: 'warning',
            actionText: 'View CE Status',
            actionUrl: '/cpa/ce',
            required: true
          },
          {
            id: 'peer_review',
            title: 'Peer Review',
            description: 'Quality control review completed',
            status: 'complete',
            required: false
          }
        ];

      case 'attorney':
        return [
          ...baseChecks,
          {
            id: 'bar_admission',
            title: 'Bar Admission',
            description: 'Valid bar admission in practice jurisdictions',
            status: 'complete',
            required: true
          },
          {
            id: 'malpractice_insurance',
            title: 'Malpractice Insurance',
            description: 'Professional liability coverage current',
            status: 'complete',
            required: true
          },
          {
            id: 'trust_account',
            title: 'Trust Account Setup',
            description: 'IOLTA or client trust account configured',
            status: 'missing',
            actionText: 'Setup Trust Account',
            actionUrl: '/attorney/trust',
            required: true
          }
        ];

      case 'insurance':
        return [
          ...baseChecks,
          {
            id: 'insurance_licenses',
            title: 'Insurance Licenses',
            description: 'Life, health, and securities licenses current',
            status: 'complete',
            required: true
          },
          {
            id: 'appointment_letters',
            title: 'Appointment Letters',
            description: 'Carrier appointments and contracting',
            status: 'complete',
            required: true
          },
          {
            id: 'medicare_certification',
            title: 'Medicare Certification',
            description: 'AHIP certification for Medicare sales',
            status: 'warning',
            actionText: 'Renew AHIP',
            actionUrl: '/insurance/ahip',
            required: false
          }
        ];

      case 'healthcare':
        return [
          ...baseChecks,
          {
            id: 'medical_license',
            title: 'Medical License',
            description: 'Valid medical license in practice states',
            status: 'complete',
            required: true
          },
          {
            id: 'hipaa_training',
            title: 'HIPAA Training',
            description: 'Current HIPAA privacy and security training',
            status: 'complete',
            required: true
          },
          {
            id: 'malpractice_coverage',
            title: 'Malpractice Coverage',
            description: 'Medical malpractice insurance current',
            status: 'complete',
            required: true
          },
          {
            id: 'cme_requirements',
            title: 'CME Requirements',
            description: 'Continuing medical education up to date',
            status: 'warning',
            actionText: 'View CME Status',
            actionUrl: '/healthcare/cme',
            required: true
          }
        ];

      case 'realtor':
        return [
          ...baseChecks,
          {
            id: 'real_estate_license',
            title: 'Real Estate License',
            description: 'Valid real estate license in practice areas',
            status: 'complete',
            required: true
          },
          {
            id: 'mls_access',
            title: 'MLS Access',
            description: 'Multiple listing service memberships current',
            status: 'complete',
            required: true
          },
          {
            id: 'ce_credits',
            title: 'CE Credits',
            description: 'Real estate continuing education current',
            status: 'warning',
            actionText: 'Update CE',
            actionUrl: '/realtor/ce',
            required: true
          }
        ];

      default:
        return baseChecks;
    }
  };

  const checks = getPersonaChecks();
  const completedCount = checks.filter(c => c.status === 'complete').length;
  const requiredCount = checks.filter(c => c.required).length;
  const progressPercent = (completedCount / checks.length) * 100;
  const isReady = checks.filter(c => c.required && c.status !== 'complete').length === 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'missing': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'missing': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const handleAction = (itemId: string, actionUrl?: string) => {
    if (onAction) {
      onAction(itemId);
    }
    
    if (actionUrl) {
      window.location.href = actionUrl;
    }
    
    // Track analytics
    console.log('[Analytics] ready_check.action', { persona, itemId, clientName });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {isReady ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
            ReadyCheck - {persona.charAt(0).toUpperCase() + persona.slice(1)}
          </CardTitle>
          <Badge variant={isReady ? "default" : "secondary"}>
            {completedCount}/{checks.length} Complete
          </Badge>
        </div>
        {clientName && (
          <p className="text-sm text-muted-foreground">Client: {clientName}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className={`p-3 rounded-lg border ${
          isReady ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              isReady ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {isReady ? 'Ready to proceed' : 'Setup required'}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Check Items */}
        <div className="space-y-2">
          {checks.map((check) => (
            <div 
              key={check.id} 
              className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(check.status)}`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{check.title}</h4>
                    {check.required && (
                      <Badge variant="outline" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{check.description}</p>
                </div>
              </div>
              
              {check.actionText && check.status !== 'complete' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAction(check.id, check.actionUrl)}
                  className="flex items-center gap-2"
                >
                  {check.actionText}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Summary Actions */}
        {!isReady && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">
              Complete required items to unlock full functionality
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => console.log('[Analytics] ready_check.help')}>
                Get Help
              </Button>
              <Button size="sm" onClick={() => window.location.reload()}>
                Refresh Status
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};