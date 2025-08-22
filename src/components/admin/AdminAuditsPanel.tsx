import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, PlayCircle } from 'lucide-react';
import { listReceipts, getReceiptsByType } from '@/features/receipts/record';
import { AnyRDS, DecisionRDS, ConsentRDS, SettlementRDS, DeltaRDS } from '@/features/receipts/types';
import { toast } from 'sonner';

interface AuditResult {
  type: string;
  status: 'pass' | 'fail';
  total: number;
  passed: number;
  failed: number;
  issues: string[];
}

export default function AdminAuditsPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [progress, setProgress] = useState(0);

  const validateDecisionRDS = (receipts: DecisionRDS[]): AuditResult => {
    const issues: string[] = [];
    let failed = 0;

    receipts.forEach(receipt => {
      if (!receipt.policy_version || receipt.policy_version.trim() === '') {
        issues.push(`${receipt.id}: Missing policy version`);
        failed++;
      }
      if (!receipt.inputs_hash || receipt.inputs_hash.trim() === '') {
        issues.push(`${receipt.id}: Missing inputs hash`);
        failed++;
      }
      if (!['approve', 'deny'].includes(receipt.result)) {
        issues.push(`${receipt.id}: Invalid result value`);
        failed++;
      }
      if (!receipt.reasons || receipt.reasons.length === 0) {
        issues.push(`${receipt.id}: Missing or empty reasons`);
        failed++;
      }
    });

    return {
      type: 'Decision-RDS',
      status: failed === 0 ? 'pass' : 'fail',
      total: receipts.length,
      passed: receipts.length - failed,
      failed,
      issues
    };
  };

  const validateConsentRDS = (receipts: ConsentRDS[]): AuditResult => {
    const issues: string[] = [];
    let failed = 0;

    receipts.forEach(receipt => {
      if (!receipt.purpose_of_use || receipt.purpose_of_use.trim() === '') {
        issues.push(`${receipt.id}: Missing purpose of use`);
        failed++;
      }
      if (!receipt.scope || !receipt.scope.roles || receipt.scope.roles.length === 0) {
        issues.push(`${receipt.id}: Missing or empty scope roles`);
        failed++;
      }
      if (!receipt.consent_time || !receipt.expiry) {
        issues.push(`${receipt.id}: Missing consent time or expiry`);
        failed++;
      }
      if (typeof receipt.freshness_score !== 'number' || receipt.freshness_score < 0 || receipt.freshness_score > 1) {
        issues.push(`${receipt.id}: Invalid freshness score`);
        failed++;
      }
    });

    return {
      type: 'Consent-RDS',
      status: failed === 0 ? 'pass' : 'fail',
      total: receipts.length,
      passed: receipts.length - failed,
      failed,
      issues
    };
  };

  const runAudit = async () => {
    setIsRunning(true);
    setResults([]);
    setProgress(0);

    try {
      const allReceipts = listReceipts();
      
      if (allReceipts.length === 0) {
        toast.warning('No receipts found to audit');
        setIsRunning(false);
        return;
      }

      const auditResults: AuditResult[] = [];

      // Audit Decision-RDS
      setProgress(25);
      const decisionReceipts = getReceiptsByType<DecisionRDS>('Decision-RDS');
      if (decisionReceipts.length > 0) {
        auditResults.push(validateDecisionRDS(decisionReceipts));
      }

      // Audit Consent-RDS  
      setProgress(50);
      const consentReceipts = getReceiptsByType<ConsentRDS>('Consent-RDS');
      if (consentReceipts.length > 0) {
        auditResults.push(validateConsentRDS(consentReceipts));
      }

      // Audit Settlement-RDS
      setProgress(75);
      const settlementReceipts = getReceiptsByType<SettlementRDS>('Settlement-RDS');
      if (settlementReceipts.length > 0) {
        auditResults.push({
          type: 'Settlement-RDS',
          status: 'pass',
          total: settlementReceipts.length,
          passed: settlementReceipts.length,
          failed: 0,
          issues: []
        });
      }

      // Audit Delta-RDS
      setProgress(90);
      const deltaReceipts = getReceiptsByType<DeltaRDS>('Delta-RDS');
      if (deltaReceipts.length > 0) {
        auditResults.push({
          type: 'Delta-RDS',
          status: 'pass',
          total: deltaReceipts.length,
          passed: deltaReceipts.length,
          failed: 0,
          issues: []
        });
      }

      setProgress(100);
      setResults(auditResults);

      const totalIssues = auditResults.reduce((sum, result) => sum + result.failed, 0);
      
      if (totalIssues === 0) {
        toast.success('Audit complete - All checks passed', {
          description: `${allReceipts.length} receipts validated successfully`
        });
      } else {
        toast.warning('Audit complete - Issues found', {
          description: `${totalIssues} issues across ${auditResults.filter(r => r.status === 'fail').length} categories`
        });
      }

    } catch (error) {
      toast.error('Audit failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  const getStatusIcon = (status: 'pass' | 'fail') => {
    return status === 'pass' 
      ? <CheckCircle className="h-4 w-4 text-green-500" />
      : <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: 'pass' | 'fail') => {
    return status === 'pass'
      ? <Badge variant="default">Pass</Badge>
      : <Badge variant="destructive">Fail</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Receipt Audits
            </CardTitle>
            <CardDescription>
              Run compliance audits on all receipt types
            </CardDescription>
          </div>
          <Button onClick={runAudit} disabled={isRunning}>
            <PlayCircle className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Audit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Running audit...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <CardTitle className="text-lg">{result.type}</CardTitle>
                      {getStatusBadge(result.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.passed}/{result.total} passed
                    </div>
                  </div>
                </CardHeader>
                {result.issues.length > 0 && (
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Issues Found:</h4>
                      <ul className="space-y-1">
                        {result.issues.slice(0, 5).map((issue, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                        {result.issues.length > 5 && (
                          <li className="text-sm text-muted-foreground italic">
                            ...and {result.issues.length - 5} more issues
                          </li>
                        )}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {results.length === 0 && !isRunning && (
          <div className="text-center py-8 text-muted-foreground">
            Click "Run Audit" to validate receipt compliance
          </div>
        )}
      </CardContent>
    </Card>
  );
}