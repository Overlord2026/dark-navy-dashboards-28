import React, { useState } from 'react';
import { listReceipts } from '@/features/receipts/record';
import { acceptNofM } from '@/features/anchor/providers';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Play, FileText } from 'lucide-react';
import { toast } from 'sonner';
import type { AnyRDS, DecisionRDS, ConsentRDS, SettlementRDS, DeltaRDS } from '@/features/receipts/types';

type AuditCheck = { id: string; type: string; ok: boolean; notes: string[] };

export function AdminAuditsPanel() {
  const [auditResults, setAuditResults] = useState<AuditCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);

  // Type guards
  const isDecision = (r: AnyRDS): r is DecisionRDS => r.type === 'Decision-RDS';
  const isConsent = (r: AnyRDS): r is ConsentRDS => r.type === 'Consent-RDS';
  const isSettlement = (r: AnyRDS): r is SettlementRDS => r.type === 'Settlement-RDS';
  const isDelta = (r: AnyRDS): r is DeltaRDS => r.type === 'Delta-RDS';

  // Shape checks (same as verifyReceipts.ts)
  const checkDecision = (r: DecisionRDS, notes: string[]) => {
    if (!r.policy_version) notes.push('missing policy_version');
    if (!r.inputs_hash) notes.push('missing inputs_hash');
    if (!r.reasons?.length) notes.push('no reasons recorded');
    if (r.action === 'publish' && !r.asset_id) notes.push('publish missing asset_id');
  };

  const checkConsent = (r: ConsentRDS, notes: string[]) => {
    if (!r.scope?.minimum_necessary) notes.push('consent scope not minimum-necessary');
    if (!r.purpose_of_use) notes.push('missing purpose_of_use');
    const now = Date.now();
    const exp = Date.parse(r.expiry);
    if (r.result === 'approve' && isFinite(exp) && exp < now) notes.push('approve but consent expired');
    if (r.result === 'deny' && r.reason === 'OK') notes.push('deny with reason=OK');
  };

  const checkSettlement = (r: SettlementRDS, notes: string[]) => {
    if (!r.offerLock) notes.push('missing offerLock');
    if (!['held', 'released'].includes(r.escrow_state)) notes.push(`invalid escrow_state ${r.escrow_state}`);
    if (!r.attribution_hash || !r.split_tree_hash) notes.push('missing attribution/split hashes');
  };

  const checkDelta = (r: DeltaRDS, notes: string[]) => {
    if (!r.prior_ref) notes.push('missing prior_ref');
    if (!r.diffs?.length) notes.push('delta has no diffs');
  };

  const checkAnchor = (r: AnyRDS, notes: string[]) => {
    const ref = (r as any).anchor_ref ?? null;
    if (!ref) return;
    
    try {
      const ok = acceptNofM(ref, 1);
      if (!ok) notes.push('anchor not accepted (N-of-M failed)');
    } catch (error) {
      notes.push('anchor verification error');
    }
  };

  const runAudit = async () => {
    setIsRunning(true);
    const receipts = listReceipts();
    const checks: AuditCheck[] = [];

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    for (const r of receipts) {
      const notes: string[] = [];
      
      if (isDecision(r)) checkDecision(r, notes);
      if (isConsent(r)) checkConsent(r, notes);
      if (isSettlement(r)) checkSettlement(r, notes);
      if (isDelta(r)) checkDelta(r, notes);
      checkAnchor(r, notes);
      
      checks.push({ 
        id: (r as any).id || 'unknown', 
        type: r.type, 
        ok: notes.length === 0, 
        notes 
      });
    }

    setAuditResults(checks);
    setLastRunTime(new Date());
    setIsRunning(false);

    const pass = checks.filter(c => c.ok).length;
    const fail = checks.length - pass;
    
    toast.success(`Audit complete: ${pass} passed, ${fail} failed`);
  };

  // Calculate summary stats
  const summary = auditResults.reduce((acc, check) => {
    acc[check.type] = acc[check.type] || { pass: 0, fail: 0 };
    check.ok ? acc[check.type].pass++ : acc[check.type].fail++;
    return acc;
  }, {} as Record<string, { pass: number; fail: number }>);

  const totalPass = auditResults.filter(c => c.ok).length;
  const totalFail = auditResults.length - totalPass;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Receipt Audit
          </span>
          <Button 
            onClick={runAudit}
            disabled={isRunning}
            variant="default"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Audit'}
          </Button>
        </CardTitle>
        <CardDescription>
          Shape validation and anchor acceptance checks for all receipts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {lastRunTime && (
          <div className="text-sm text-muted-foreground">
            Last run: {lastRunTime.toLocaleString()}
          </div>
        )}

        {auditResults.length > 0 && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-2xl font-bold">{totalPass}</span>
                </div>
                <p className="text-sm text-muted-foreground">Passed</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-2xl font-bold">{totalFail}</span>
                </div>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </div>

            {/* Results by Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Results by Type</h3>
              <div className="space-y-2">
                {Object.entries(summary).map(([type, stats]) => (
                  <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600">{stats.pass} pass</span>
                      <span className="text-red-600">{stats.fail} fail</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Failed Checks Detail */}
            {totalFail > 0 && (
              <div className="space-y-4">
                <Separator />
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Failed Checks
                </h3>
                <div className="space-y-3">
                  {auditResults
                    .filter(check => !check.ok)
                    .map((check, index) => (
                      <div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="destructive">{check.type}</Badge>
                          <span className="font-mono text-xs text-muted-foreground">
                            {check.id.substring(0, 8)}...
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {check.notes.map((note, noteIndex) => (
                            <li key={noteIndex} className="text-sm text-red-800">
                              • {note}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {totalFail === 0 && totalPass > 0 && (
              <div className="text-center p-6 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-semibold">
                  ✅ All receipts passed basic integrity & anchor checks
                </p>
              </div>
            )}
          </>
        )}

        {auditResults.length === 0 && !isRunning && (
          <div className="text-center py-8 text-muted-foreground">
            Run an audit to see receipt validation results
          </div>
        )}
      </CardContent>
    </Card>
  );
}