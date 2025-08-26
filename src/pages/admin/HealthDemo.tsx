import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { recordReceipt } from '@/features/receipts/store';
import { submitPARequest, submitPAAppeal, type PARequest, type PADenial, type PAAppeal } from '@/features/health/pa';
import { grantPRE, revokePRE, recordPREDisclosure, type PREGrant } from '@/features/health/vault';
import { Play, CheckCircle, XCircle, AlertCircle, FileText, Shield, Clock } from 'lucide-react';

interface DemoResult {
  paRequest?: PARequest;
  paDenial?: PADenial;
  paAppeal?: PAAppeal;
  preGrant?: PREGrant;
  receipts: any[];
  executionLog: string[];
}

export default function HealthDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [demoResult, setDemoResult] = useState<DemoResult | null>(null);

  const runHealthDemo = async () => {
    setIsRunning(true);
    const receipts: any[] = [];
    const executionLog: string[] = [];
    
    try {
      executionLog.push('🏥 Starting Healthcare Orchestration Demo...');

      // 1. Generate Consent-RDS (predicates)
      await recordReceipt({
        receipt_id: `rds_consent_demo_${Date.now()}`,
        type: 'Consent-RDS',
        ts: new Date().toISOString(),
        policy_version: 'HEALTH-2025',
        inputs_hash: 'sha256:demo_consent',
        consent_details: {
          scope: ['medical_records', 'treatment_history', 'billing_info'],
          purpose_of_use: 'prior_authorization',
          minimum_necessary: true,
          predicates: ['patient_verified', 'hipaa_compliant'],
          expiry_days: 90
        },
        reasons: ['hipaa_consent', 'pa_required', 'demo_mode']
      });
      
      receipts.push({
        type: 'Consent-RDS',
        status: 'generated',
        scope: ['medical_records', 'treatment_history', 'billing_info']
      });
      executionLog.push('✅ Consent-RDS generated (HIPAA predicates)');

      // 2. Generate Decision-RDS deny (minimum necessary ok, predicate fail for demo)
      await recordReceipt({
        receipt_id: `rds_decision_deny_${Date.now()}`,
        type: 'Decision-RDS',
        ts: new Date().toISOString(),
        policy_version: 'HEALTH-2025',
        inputs_hash: 'sha256:demo_decision_deny',
        decision_details: {
          action: 'initial_review',
          result: 'deny',
          minimum_necessary_check: 'pass',
          predicate_check: 'fail',
          failed_predicates: ['medical_necessity_documentation']
        },
        reasons: ['min_necessary_ok', 'predicate_fail', 'insufficient_evidence']
      });
      
      receipts.push({
        type: 'Decision-RDS',
        result: 'deny',
        reason: 'predicate_fail'
      });
      executionLog.push('❌ Decision-RDS deny (predicate fail)');

      // 3. Submit PA request that gets denied
      const { pa_request, denial } = await submitPARequest(
        '99213', // Procedure code
        'M54.5', // Diagnosis code  
        'provider_demo_001',
        'patient_demo_001'
      );
      
      receipts.push({
        type: 'PA-RDS',
        result: 'deny',
        missing_evidence: denial.missing_evidence
      });
      executionLog.push(`❌ PA-RDS deny (missing: ${denial.missing_evidence.join(', ')})`);

      // 4. Submit appeal with remedies
      const { appeal } = await submitPAAppeal(
        pa_request.id,
        ['upload_physician_note', 'provide_diagnostic_results'],
        ['physician_note_hash_001', 'diagnostic_results_hash_001']
      );
      
      receipts.push({
        type: 'Delta-RDS',
        operation: 'appeal_submitted',
        remedies: appeal.remedies
      });
      executionLog.push('📋 Delta-RDS appeal + remedies');

      receipts.push({
        type: 'Decision-RDS',
        result: 'approve',
        basis: 'appeal_cured'
      });
      executionLog.push('✅ Decision-RDS approve (appeal cured)');

      // 5. Generate Settlement-RDS for OOP/HSA band
      await recordReceipt({
        receipt_id: `rds_settlement_${Date.now()}`,
        type: 'Settlement-RDS',
        ts: new Date().toISOString(),
        policy_version: 'HEALTH-2025',
        inputs_hash: 'sha256:demo_settlement',
        settlement_details: {
          pa_request_id: pa_request.id,
          approved_amount_cents: 50000, // $500
          patient_responsibility_cents: 5000, // $50 copay
          insurance_coverage_cents: 45000, // $450
          hsa_eligible: true,
          oop_band: 'low_deductible'
        },
        reasons: ['pa_approved', 'coverage_calculated', 'hsa_eligible']
      });
      
      receipts.push({
        type: 'Settlement-RDS',
        approved_amount: '$500',
        patient_responsibility: '$50'
      });
      executionLog.push('💰 Settlement-RDS (OOP/HSA band)');

      // 6. PRE Grant, Disclosure, and Revoke cycle
      const preGrant = await grantPRE(
        ['medical_records', 'lab_results', 'imaging'],
        30, // 30 days TTL
        'treatment_coordination'
      );
      
      receipts.push({
        type: 'Vault-RDS',
        action: 'grant',
        grant_id: preGrant.grant_id,
        ttl_days: 30
      });
      executionLog.push(`🔐 Vault-RDS PRE grant (${preGrant.grant_id})`);

      // Record some disclosures
      await recordPREDisclosure(
        preGrant.grant_id,
        'sha256:medical_record_001',
        'specialist_provider_002'
      );
      
      await recordPREDisclosure(
        preGrant.grant_id,
        'sha256:lab_results_001',
        'specialist_provider_002'
      );
      
      receipts.push({
        type: 'Vault-RDS',
        action: 'disclose',
        doc_count: 2
      });
      executionLog.push('📄 Vault-RDS disclosures (2 documents)');

      // Revoke the grant
      await revokePRE(preGrant.grant_id, 'treatment_completed');
      
      receipts.push({
        type: 'Vault-RDS',
        action: 'revoke',
        reason: 'treatment_completed'
      });
      executionLog.push('🔒 Vault-RDS PRE revoked');

      executionLog.push('✅ Healthcare demo completed successfully!');

      setDemoResult({
        paRequest: pa_request,
        paDenial: denial,
        paAppeal: appeal,
        preGrant,
        receipts,
        executionLog
      });
      
    } catch (error) {
      executionLog.push(`❌ Demo failed: ${(error as Error).message}`);
      setDemoResult({ receipts, executionLog });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (type: string, result?: string) => {
    if (type === 'PA-RDS' && result === 'deny') return <XCircle className="h-4 w-4 text-red-600" />;
    if (type === 'Decision-RDS' && result === 'deny') return <XCircle className="h-4 w-4 text-red-600" />;
    if (type === 'Decision-RDS' && result === 'approve') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (type === 'Delta-RDS') return <AlertCircle className="h-4 w-4 text-blue-600" />;
    if (type === 'Vault-RDS') return <Shield className="h-4 w-4 text-purple-600" />;
    return <FileText className="h-4 w-4 text-gray-600" />;
  };

  const getStatusColor = (type: string, result?: string) => {
    if ((type === 'PA-RDS' || type === 'Decision-RDS') && result === 'deny') return 'bg-red-100 text-red-800';
    if (type === 'Decision-RDS' && result === 'approve') return 'bg-green-100 text-green-800';
    if (type === 'Delta-RDS') return 'bg-blue-100 text-blue-800';
    if (type === 'Vault-RDS') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Healthcare Orchestration - Demo</h1>
          <p className="text-muted-foreground">
            Run denial→appeal workflow with PRE grant/revoke cycle
          </p>
        </div>
        
        <Button 
          onClick={runHealthDemo} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          {isRunning ? 'Running Demo...' : 'Run Denial→Appeal'}
        </Button>
      </div>

      {demoResult && (
        <div className="grid gap-6">
          {/* Execution Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Execution Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {demoResult.executionLog.map((log, idx) => (
                  <div key={idx} className="text-sm font-mono bg-gray-50 p-2 rounded">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Receipt Chain */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Receipt Chain ({demoResult.receipts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoResult.receipts.map((receipt, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(receipt.type, receipt.result)}
                        <span className="font-medium">{receipt.type}</span>
                      </div>
                      <Badge className={getStatusColor(receipt.type, receipt.result)}>
                        {receipt.result || receipt.action || receipt.operation || 'processed'}
                      </Badge>
                    </div>
                    
                    {receipt.missing_evidence && (
                      <div className="text-sm text-red-600 mb-1">
                        <strong>Missing:</strong> {receipt.missing_evidence.join(', ')}
                      </div>
                    )}
                    
                    {receipt.remedies && (
                      <div className="text-sm text-blue-600 mb-1">
                        <strong>Remedies:</strong> {receipt.remedies.join(', ')}
                      </div>
                    )}
                    
                    {receipt.scope && (
                      <div className="text-sm text-purple-600 mb-1">
                        <strong>Scope:</strong> {receipt.scope.join(', ')}
                      </div>
                    )}
                    
                    {receipt.grant_id && (
                      <div className="text-xs text-muted-foreground">
                        Grant ID: {receipt.grant_id}
                        {receipt.ttl_days && ` (${receipt.ttl_days} days TTL)`}
                      </div>
                    )}
                    
                    {receipt.approved_amount && (
                      <div className="text-sm text-green-600">
                        <strong>Coverage:</strong> {receipt.approved_amount} total, {receipt.patient_responsibility} patient responsibility
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* PA Details */}
          {demoResult.paRequest && (
            <Card>
              <CardHeader>
                <CardTitle>PA Request Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>PA ID:</strong> {demoResult.paRequest.id}
                  </div>
                  <div>
                    <strong>Status:</strong> 
                    <Badge className="ml-2">{demoResult.paRequest.status}</Badge>
                  </div>
                  <div>
                    <strong>Procedure:</strong> {demoResult.paRequest.procedure_code}
                  </div>
                  <div>
                    <strong>Diagnosis:</strong> {demoResult.paRequest.diagnosis_code}
                  </div>
                  {demoResult.paDenial && (
                    <>
                      <div className="col-span-2">
                        <strong>Denial Reasons:</strong> {demoResult.paDenial.reason_codes.join(', ')}
                      </div>
                      <div className="col-span-2">
                        <strong>Missing Evidence:</strong> {demoResult.paDenial.missing_evidence.join(', ')}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* PRE Grant Details */}
          {demoResult.preGrant && (
            <Card>
              <CardHeader>
                <CardTitle>PRE Grant Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Grant ID:</strong> {demoResult.preGrant.grant_id}
                  </div>
                  <div>
                    <strong>Status:</strong> 
                    <Badge className="ml-2">{demoResult.preGrant.status}</Badge>
                  </div>
                  <div>
                    <strong>TTL:</strong> {demoResult.preGrant.ttl_days} days
                  </div>
                  <div>
                    <strong>Disclosures:</strong> {demoResult.preGrant.disclosures.length}
                  </div>
                  <div className="col-span-2">
                    <strong>Scope:</strong> {demoResult.preGrant.scope_fields.join(', ')}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        <strong>Demo workflow:</strong> Consent-RDS → Decision-RDS deny → PA-RDS deny → Delta-RDS appeal → Decision-RDS approve → Settlement-RDS → Vault-RDS (grant/disclose/revoke).
        All receipts are content-free with no PHI/PII.
      </div>
    </div>
  );
}