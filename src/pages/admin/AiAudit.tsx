import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { listReceipts, getReceiptsByType } from '@/features/receipts/record';
import { getProofSlips, getProofSlipStats } from '@/features/ai/decisions/engine';
import { SAFETY_POLICY, GOVERNANCE_LEVELS } from '@/features/ai/governance/policy';

export default function AiAudit() {
  const [auditData, setAuditData] = React.useState<any>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    generateAuditSummary();
  }, []);

  async function generateAuditSummary() {
    try {
      const receipts = listReceipts();
      const proofSlips = getProofSlips();
      const proofSlipStats = getProofSlipStats();
      
      const summary = {
        totalReceipts: receipts.length,
        receiptsByType: receipts.reduce((acc: any, receipt: any) => {
          acc[receipt.type] = (acc[receipt.type] || 0) + 1;
          return acc;
        }, {}),
        aiInteractions: receipts.filter((r: any) => r.action?.startsWith('ai.')).length,
        decisionReceipts: getReceiptsByType('Decision-RDS').length,
        consentReceipts: getReceiptsByType('Consent-RDS').length,
        vaultReceipts: getReceiptsByType('Vault-RDS').length,
        proofSlips: {
          total: proofSlipStats.total,
          byAction: proofSlipStats.byAction,
          byRule: proofSlipStats.byRule
        },
        policyCompliance: {
          safetyPolicyEnabled: true,
          contentFreeLogging: SAFETY_POLICY.contentFreeLogging,
          dualApprovalRequired: SAFETY_POLICY.requireDualApproval,
          auditTrailComplete: receipts.length > 0
        },
        lastUpdated: new Date().toISOString()
      };

      setAuditData(summary);
    } catch (error) {
      console.error('Failed to generate audit summary:', error);
      toast({
        title: "Error",
        description: "Failed to generate audit summary.",
        variant: "destructive"
      });
    }
  }

  async function exportAuditData() {
    setIsGenerating(true);
    try {
      const receipts = listReceipts();
      const proofSlips = getProofSlips();
      
      // Create content-free export (only metadata, no sensitive data)
      const auditExport = {
        metadata: {
          exportDate: new Date().toISOString(),
          totalReceipts: receipts.length,
          totalProofSlips: proofSlips.length,
          version: '1.0'
        },
        receiptKeys: receipts.map((r: any) => ({
          id: r.id || 'unknown',
          type: r.type,
          action: r.action,
          timestamp: r.created_at,
          reasonCount: Array.isArray(r.reasons) ? r.reasons.length : 0
          // No actual content or sensitive data
        })),
        proofSlipHashes: proofSlips.map(slip => ({
          id: slip.id,
          ruleId: slip.ruleId,
          hash: slip.hash,
          timestamp: slip.timestamp
          // No context or sensitive data
        })),
        policySnapshot: {
          safetyPolicyEnabled: true,
          governanceLevels: Object.keys(GOVERNANCE_LEVELS),
          contentFreeLogging: SAFETY_POLICY.contentFreeLogging
        }
      };

      const blob = new Blob([JSON.stringify(auditExport, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai_audit_export_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);

      toast({
        title: "Audit Export Complete",
        description: `Exported ${auditExport.receiptKeys.length} receipts and ${auditExport.proofSlipHashes.length} proof slips.`
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export audit data.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }

  async function exportReceiptKeys() {
    try {
      const receipts = listReceipts();
      const receiptKeys = receipts.map((r: any) => r.action).filter(Boolean);
      const uniqueKeys = [...new Set(receiptKeys)];
      
      const exportData = {
        uniqueActions: uniqueKeys.sort(),
        actionCounts: receiptKeys.reduce((acc: any, key: string) => {
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {}),
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ai_receipt_keys.json';
      a.click();
      
      URL.revokeObjectURL(url);

      toast({
        title: "Receipt Keys Exported",
        description: `Exported ${uniqueKeys.length} unique action keys.`
      });
    } catch (error) {
      console.error('Receipt keys export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export receipt keys.",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AI Governance & Audit</h1>
        <Badge variant="secondary" className="text-xs">
          Content-Free Logging
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button onClick={exportAuditData} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Export Full Audit'}
        </Button>
        <Button variant="outline" onClick={exportReceiptKeys}>
          Export Receipt Keys
        </Button>
        <Button variant="outline" onClick={generateAuditSummary}>
          Refresh Summary
        </Button>
      </div>

      {/* Audit Summary */}
      {auditData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Total Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auditData.totalReceipts}</div>
              <div className="text-xs text-muted-foreground">Audit Receipts</div>
              <Separator className="my-2" />
              <div className="text-lg font-semibold">{auditData.aiInteractions}</div>
              <div className="text-xs text-muted-foreground">AI Interactions</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Receipt Types</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(auditData.receiptsByType).map(([type, count]: [string, any]) => (
                <div key={type} className="flex justify-between items-center py-1">
                  <span className="text-xs">{type}</span>
                  <Badge variant="outline" className="text-xs">{count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Proof Slips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{auditData.proofSlips.total}</div>
              <div className="text-xs text-muted-foreground">Decision Proofs</div>
              <Separator className="my-2" />
              <div className="space-y-1">
                {Object.entries(auditData.proofSlips.byAction).slice(0, 3).map(([action, count]: [string, any]) => (
                  <div key={action} className="flex justify-between items-center">
                    <span className="text-xs truncate">{action}</span>
                    <span className="text-xs">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Policy Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-sm font-medium ${SAFETY_POLICY.contentFreeLogging ? 'text-green-600' : 'text-red-600'}`}>
                {SAFETY_POLICY.contentFreeLogging ? '✓' : '✗'} Content-Free Logging
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-medium ${SAFETY_POLICY.requireDualApproval ? 'text-green-600' : 'text-red-600'}`}>
                {SAFETY_POLICY.requireDualApproval ? '✓' : '✗'} Dual Approval
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-medium ${SAFETY_POLICY.blockSensitiveQueries ? 'text-green-600' : 'text-red-600'}`}>
                {SAFETY_POLICY.blockSensitiveQueries ? '✓' : '✗'} Content Filter
              </div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-medium ${auditData?.totalReceipts > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                {auditData?.totalReceipts > 0 ? '✓' : '⚠'} Audit Trail
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Governance Levels Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Governance Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(GOVERNANCE_LEVELS).map(([level, config]: [string, any]) => (
              <div key={level} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <span className="font-medium text-sm">{level}</span>
                  <div className="text-xs text-muted-foreground">
                    {config.allowedTools.includes('*') ? 'All tools' : `${config.allowedTools.length} tools`} • 
                    Max {config.maxDailyInteractions}/day • 
                    {config.requireSupervisorApproval ? 'Requires approval' : 'Self-service'}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {config.allowedTools.length === 1 && config.allowedTools[0] === '*' ? 'Admin' : 'Limited'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}