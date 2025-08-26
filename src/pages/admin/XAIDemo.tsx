import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  generateExplainabilityPacket, 
  bindPacketToAction, 
  logPacketAccess,
  getExplainabilityPacket,
  type ExplainabilityPacket,
  type ExplainabilityFeature,
  type FairnessMetrics,
  type PacketBinding,
  type AccessLog
} from '@/features/xai/packet';
import { replayVerifyPacket, type ReplayVerificationResult } from '@/features/xai/replay';
import { 
  Brain, 
  Link, 
  Eye, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Shield,
  Activity,
  FileCheck
} from 'lucide-react';

interface DemoResult {
  packet?: ExplainabilityPacket;
  binding?: PacketBinding;
  accessLog?: AccessLog;
  verificationResult?: ReplayVerificationResult;
  receipts: any[];
  executionLog: string[];
}

export default function XAIDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [demoResult, setDemoResult] = useState<DemoResult | null>(null);
  const [selectedPacketId, setSelectedPacketId] = useState<string>('');

  const runXAIDemo = async () => {
    setIsRunning(true);
    const receipts: any[] = [];
    const executionLog: string[] = [];
    
    try {
      executionLog.push('🧠 Starting AI Explainability Demo...');

      // 1. Generate explainability packet
      const demoFeatures: ExplainabilityFeature[] = [
        { name: 'credit_score', importance: 0.45, band: 'high', category: 'financial' },
        { name: 'income_level', importance: 0.32, band: 'high', category: 'financial' },
        { name: 'employment_history', importance: 0.18, band: 'medium', category: 'employment' },
        { name: 'debt_ratio', importance: 0.28, band: 'medium', category: 'financial' },
        { name: 'age_group', importance: 0.12, band: 'low', category: 'demographic' }
      ];

      const demoFairness: FairnessMetrics = {
        demographic_parity: 0.85,
        equality_of_opportunity: 0.92,
        bias_score: 0.15,
        protected_attributes: ['age_group', 'geographic_region']
      };

      const packet = await generateExplainabilityPacket(
        'credit_risk_model_v2',
        '2.1.4',
        { feature_count: demoFeatures.length }, // Content-free inputs
        demoFeatures,
        demoFairness
      );

      setSelectedPacketId(packet.id);
      receipts.push({
        type: 'Explainability-RDS',
        packet_id: packet.id,
        model_id: packet.model_id,
        feature_count: packet.features.length
      });
      executionLog.push(`✅ Explainability-RDS generated (${packet.id})`);

      // 2. Bind packet to a trade action
      const binding = await bindPacketToAction(
        packet.id,
        'trade_action_20250826_001',
        'automated_trading'
      );

      receipts.push({
        type: 'Binding-RDS',
        binding_id: binding.id,
        action_class: binding.action_class
      });
      executionLog.push(`🔗 Binding-RDS created (${binding.action_class})`);

      // 3. Log access as regulator
      const accessLog = await logPacketAccess(
        packet.id,
        'financial_regulator',
        'read',
        'compliance_audit'
      );

      receipts.push({
        type: 'Access-RDS',
        accessor_role: accessLog.accessor_role,
        access_scope: accessLog.access_scope,
        purpose: accessLog.purpose
      });
      executionLog.push(`👁️ Access-RDS logged (${accessLog.accessor_role})`);

      // 4. Perform replay verification
      const verificationResult = await replayVerifyPacket(packet.id);

      receipts.push({
        type: 'Decision-RDS',
        action: 'replay.verify',
        result: verificationResult.verification_status,
        hash_match: verificationResult.original_hash === verificationResult.recomputed_hash
      });
      executionLog.push(`🔍 Replay verification: ${verificationResult.verification_status}`);

      executionLog.push('✅ XAI demo completed successfully!');

      setDemoResult({
        packet,
        binding,
        accessLog,
        verificationResult,
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

  const runStandaloneVerify = async () => {
    if (!selectedPacketId) return;
    
    setIsRunning(true);
    try {
      const verificationResult = await replayVerifyPacket(selectedPacketId);
      
      if (demoResult) {
        setDemoResult({
          ...demoResult,
          verificationResult,
          executionLog: [
            ...demoResult.executionLog,
            `🔍 Standalone verification: ${verificationResult.verification_status}`
          ]
        });
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (type: string, result?: string) => {
    if (type === 'Explainability-RDS') return <Brain className="h-4 w-4 text-purple-600" />;
    if (type === 'Binding-RDS') return <Link className="h-4 w-4 text-blue-600" />;
    if (type === 'Access-RDS') return <Eye className="h-4 w-4 text-green-600" />;
    if (type === 'Decision-RDS') {
      if (result === 'ok') return <CheckCircle className="h-4 w-4 text-green-600" />;
      if (result === 'fail') return <XCircle className="h-4 w-4 text-red-600" />;
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
    return <FileCheck className="h-4 w-4 text-gray-600" />;
  };

  const getStatusColor = (type: string, result?: string) => {
    if (type === 'Explainability-RDS') return 'bg-purple-100 text-purple-800';
    if (type === 'Binding-RDS') return 'bg-blue-100 text-blue-800';
    if (type === 'Access-RDS') return 'bg-green-100 text-green-800';
    if (type === 'Decision-RDS') {
      if (result === 'ok') return 'bg-green-100 text-green-800';
      if (result === 'fail') return 'bg-red-100 text-red-800';
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI Explainability - Demo</h1>
          <p className="text-muted-foreground">
            Generate explainability packets, binding, access logs, and replay verification
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedPacketId && (
            <Button 
              onClick={runStandaloneVerify} 
              disabled={isRunning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Replay Verify
            </Button>
          )}
          
          <Button 
            onClick={runXAIDemo} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Brain className="h-4 w-4" />
            {isRunning ? 'Running Demo...' : 'Generate XAI Packet'}
          </Button>
        </div>
      </div>

      {demoResult && (
        <div className="grid gap-6">
          {/* Execution Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
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
                        {receipt.result || receipt.action || receipt.access_scope || 'processed'}
                      </Badge>
                    </div>
                    
                    {receipt.packet_id && (
                      <div className="text-xs text-muted-foreground mb-1">
                        Packet ID: {receipt.packet_id}
                      </div>
                    )}
                    
                    {receipt.model_id && (
                      <div className="text-sm text-purple-600 mb-1">
                        <strong>Model:</strong> {receipt.model_id}
                        {receipt.feature_count && ` (${receipt.feature_count} features)`}
                      </div>
                    )}
                    
                    {receipt.action_class && (
                      <div className="text-sm text-blue-600 mb-1">
                        <strong>Action Class:</strong> {receipt.action_class}
                      </div>
                    )}
                    
                    {receipt.accessor_role && (
                      <div className="text-sm text-green-600 mb-1">
                        <strong>Accessor:</strong> {receipt.accessor_role} ({receipt.access_scope})
                        {receipt.purpose && ` - ${receipt.purpose}`}
                      </div>
                    )}
                    
                    {receipt.hash_match !== undefined && (
                      <div className="text-sm">
                        <strong>Hash Match:</strong> 
                        <Badge className={`ml-2 ${receipt.hash_match ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {receipt.hash_match ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Explainability Packet Details */}
          {demoResult.packet && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Explainability Packet Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <strong>Packet ID:</strong> {demoResult.packet.id}
                  </div>
                  <div>
                    <strong>Model:</strong> {demoResult.packet.model_id} v{demoResult.packet.model_version}
                  </div>
                  <div>
                    <strong>Confidence:</strong> {(demoResult.packet.confidence_score || 0).toFixed(3)}
                  </div>
                  <div>
                    <strong>Features:</strong> {demoResult.packet.features.length}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <strong className="block mb-2">Feature Importance:</strong>
                    <div className="space-y-2">
                      {demoResult.packet.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="font-medium">{feature.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{feature.importance.toFixed(3)}</span>
                            <Badge variant={feature.band === 'high' ? 'default' : feature.band === 'medium' ? 'secondary' : 'outline'}>
                              {feature.band}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <strong className="block mb-2">Fairness Metrics:</strong>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Demographic Parity: {demoResult.packet.fairness.demographic_parity?.toFixed(3)}</div>
                      <div>Equality of Opportunity: {demoResult.packet.fairness.equality_of_opportunity?.toFixed(3)}</div>
                      <div>Bias Score: {demoResult.packet.fairness.bias_score?.toFixed(3)}</div>
                      <div>Protected Attributes: {demoResult.packet.fairness.protected_attributes?.length || 0}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Results */}
          {demoResult.verificationResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Replay Verification Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Status:</strong> 
                    <Badge className={`ml-2 ${demoResult.verificationResult.verification_status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {demoResult.verificationResult.verification_status}
                    </Badge>
                  </div>
                  <div>
                    <strong>Hash Match:</strong> 
                    <Badge className={`ml-2 ${demoResult.verificationResult.original_hash === demoResult.verificationResult.recomputed_hash ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {demoResult.verificationResult.original_hash === demoResult.verificationResult.recomputed_hash ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <strong>Original Hash:</strong> 
                    <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{demoResult.verificationResult.original_hash}</code>
                  </div>
                  <div className="col-span-2">
                    <strong>Recomputed Hash:</strong> 
                    <code className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">{demoResult.verificationResult.recomputed_hash}</code>
                  </div>
                  {demoResult.verificationResult.discrepancies && demoResult.verificationResult.discrepancies.length > 0 && (
                    <div className="col-span-2">
                      <strong>Discrepancies:</strong>
                      <ul className="list-disc list-inside ml-2 text-red-600">
                        {demoResult.verificationResult.discrepancies.map((disc, idx) => (
                          <li key={idx}>{disc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        <strong>Demo workflow:</strong> Generate Explainability-RDS → Bind to Trade (Binding-RDS) → Regulator Access (Access-RDS) → Replay Verify (Decision-RDS).
        All packets are content-free with no PII/PHI, featuring hash-based integrity verification.
      </div>
    </div>
  );
}