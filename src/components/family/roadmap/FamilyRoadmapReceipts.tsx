import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Eye, 
  Download, 
  Shield, 
  Calendar, 
  FileText,
  Lock,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface ReceiptItem {
  id: string;
  type: 'decision' | 'consent' | 'settlement' | 'delta';
  action: string;
  result: 'approve' | 'deny' | 'pending';
  timestamp: string;
  policyVersion: string;
  reasons: string[];
  isAnchored: boolean;
  previewData: {
    summary: string;
    details: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export default function FamilyRoadmapReceipts() {
  const [receipts] = useState<ReceiptItem[]>([
    {
      id: 'rds_decision_001',
      type: 'decision',
      action: 'retirement_income_strategy',
      result: 'approve',
      timestamp: '2024-12-01T10:30:00Z',
      policyVersion: 'RET-2024.12',
      reasons: ['INCOME_ADEQUATE', 'RISK_APPROPRIATE', 'TAX_OPTIMIZED'],
      isAnchored: true,
      previewData: {
        summary: 'Retirement income withdrawal strategy approved for 4% annual rate',
        details: [
          'Social Security optimization timing verified',
          'RMD strategy aligned with tax brackets',
          'Portfolio allocation appropriate for age and risk tolerance',
          'Healthcare cost projections included'
        ],
        riskLevel: 'low'
      }
    },
    {
      id: 'rds_consent_002',
      type: 'consent',
      action: 'healthcare_data_sharing',
      result: 'approve',
      timestamp: '2024-11-28T14:15:00Z',
      policyVersion: 'HEALTH-2024.11',
      reasons: ['HIPAA_COMPLIANT', 'EMERGENCY_ACCESS', 'FAMILY_AUTHORIZED'],
      isAnchored: true,
      previewData: {
        summary: 'Healthcare data sharing consent approved for family emergency access',
        details: [
          'Emergency contact authorization verified',
          'HIPAA compliance maintained',
          'Limited scope for medical emergencies only',
          'Revocation process documented'
        ],
        riskLevel: 'low'
      }
    },
    {
      id: 'rds_settlement_003',
      type: 'settlement',
      action: 'medicare_enrollment',
      result: 'approve',
      timestamp: '2024-11-15T09:45:00Z',
      policyVersion: 'MED-2024.11',
      reasons: ['ENROLLMENT_PERIOD', 'ELIGIBILITY_CONFIRMED', 'COVERAGE_OPTIMIZED'],
      isAnchored: true,
      previewData: {
        summary: 'Medicare enrollment and supplement plan selection completed',
        details: [
          'Part B enrollment within initial period',
          'Supplement Plan G selected for comprehensive coverage',
          'Drug plan optimized for current prescriptions',
          'Effective date: January 1, 2025'
        ],
        riskLevel: 'low'
      }
    },
    {
      id: 'rds_decision_004',
      type: 'decision',
      action: 'estate_planning_update',
      result: 'pending',
      timestamp: '2024-12-01T16:20:00Z',
      policyVersion: 'EST-2024.12',
      reasons: ['BENEFICIARY_REVIEW_NEEDED', 'TRUST_FUNDING_INCOMPLETE'],
      isAnchored: false,
      previewData: {
        summary: 'Estate planning documents require updates and review',
        details: [
          'Beneficiary designations need updating after family changes',
          'Trust funding strategy requires revision',
          'Power of attorney documents need refresh',
          'Tax law changes may affect planning'
        ],
        riskLevel: 'medium'
      }
    },
    {
      id: 'rds_delta_005',
      type: 'delta',
      action: 'tax_strategy_adjustment',
      result: 'approve',
      timestamp: '2024-11-20T11:30:00Z',
      policyVersion: 'TAX-2024.11',
      reasons: ['TAX_LAW_CHANGE', 'INCOME_OPTIMIZATION', 'ROTH_CONVERSION_OPPORTUNITY'],
      isAnchored: true,
      previewData: {
        summary: 'Tax strategy adjusted for optimal Roth conversion timing',
        details: [
          'Conversion amount adjusted from $50,000 to $35,000',
          'Lower income year identified for tax efficiency',
          'Medicare IRMAA thresholds considered',
          'Multi-year conversion strategy planned'
        ],
        riskLevel: 'low'
      }
    }
  ]);

  const handleRestrictedAction = (action: string) => {
    toast.error(`${action} requires authentication`, {
      description: 'Login to access detailed receipt information'
    });
  };

  const getReceiptIcon = (type: string) => {
    switch (type) {
      case 'decision': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'consent': return <Shield className="h-4 w-4 text-purple-500" />;
      case 'settlement': return <FileText className="h-4 w-4 text-emerald-500" />;
      case 'delta': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return <Receipt className="h-4 w-4" />;
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'approve': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'deny': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-emerald-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-500" />
            Compliance Receipts Preview
          </h3>
          <p className="text-sm text-muted-foreground">
            Cryptographically verified records of retirement planning decisions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Eye className="h-3 w-3" />
            Read-only Demo
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleRestrictedAction('Export receipts')}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
            <Lock className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {receipts.map((receipt) => (
          <div key={receipt.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {getReceiptIcon(receipt.type)}
                <div>
                  <h4 className="font-medium capitalize">
                    {receipt.action.replace(/_/g, ' ')}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(receipt.timestamp).toLocaleString()}
                    <span>•</span>
                    <span>Policy: {receipt.policyVersion}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getResultColor(receipt.result)}>
                  {receipt.result}
                </Badge>
                {receipt.isAnchored && (
                  <Badge variant="outline" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Anchored
                  </Badge>
                )}
              </div>
            </div>

            {/* Watermarked Preview */}
            <div className="bg-muted/50 rounded-lg p-4 border-2 border-dashed border-muted-foreground/30 relative">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <div className="text-6xl font-bold text-muted-foreground transform -rotate-12">
                  DEMO
                </div>
              </div>
              
              <div className="relative space-y-3">
                <div className="flex items-start justify-between">
                  <p className="font-medium text-sm">{receipt.previewData.summary}</p>
                  <Badge variant="outline" className={getRiskColor(receipt.previewData.riskLevel)}>
                    {receipt.previewData.riskLevel} risk
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {receipt.previewData.details.map((detail, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-3 w-3 text-emerald-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-muted">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Reasons:</span>
                    {receipt.reasons.map((reason, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {reason.replace(/_/g, ' ').toLowerCase()}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRestrictedAction('View full receipt')}
                    className="gap-1 text-xs"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Full
                    <Lock className="h-2 w-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-blue-800">
            <h4 className="font-medium text-sm mb-1">About Compliance Receipts</h4>
            <p className="text-xs leading-relaxed">
              These cryptographically signed receipts provide an immutable audit trail of all retirement planning decisions. 
              Each receipt is anchored to a blockchain for verification and can be used to demonstrate compliance with 
              fiduciary standards and regulatory requirements. Login to access detailed receipts with full cryptographic proofs.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}