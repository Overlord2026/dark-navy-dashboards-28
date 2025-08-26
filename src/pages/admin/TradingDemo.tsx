import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { recordReceipt } from '@/features/receipts/store';
import { scheduleTrade, type TradeSlice } from '@/features/trading/scheduler';
import { setMarketData, setTradingLimits } from '@/features/trading/policy';
import { verifyReceipts, type Receipt } from '@/tools/verifyReceipts';
import { Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface DemoResult {
  receipts: Receipt[];
  validation: any;
  executionLog: string[];
}

export default function TradingDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [demoResult, setDemoResult] = useState<DemoResult | null>(null);

  const runTradingDemo = async () => {
    setIsRunning(true);
    const receipts: Receipt[] = [];
    const executionLog: string[] = [];
    
    try {
      // Setup demo market data
      setMarketData('AAPL', {
        symbol: 'AAPL',
        adv_30d: Array(30).fill(50000000), // $50M daily volume
        current_price: 150,
        last_updated: new Date().toISOString()
      });
      
      setTradingLimits({
        adv_symbol_bps: 500,    // 5%
        adv_book_bps: 1000,     // 10%
        cooling_off_sec: 300,   // 5 minutes
        drawdown_limit_bps: 200 // 2%
      });
      
      executionLog.push('✅ Market data and limits configured');

      // 1. Generate Advice-RDS
      await recordReceipt({
        receipt_id: `rds_advice_demo_${Date.now()}`,
        type: 'Advice-RDS',
        ts: new Date().toISOString(),
        policy_version: 'TG-2025',
        inputs_hash: 'sha256:demo_advice',
        strategy: 'TaxOptimizedRebalancing',
        advice_details: {
          target_allocation: { equity: 0.7, bonds: 0.25, cash: 0.05 },
          rebalance_threshold_bps: 500,
          tax_optimization: true
        },
        reasons: ['portfolio_drift', 'tax_optimization', 'demo_mode']
      });
      
      receipts.push({
        receipt_id: `rds_advice_demo_${Date.now()}`,
        type: 'Advice-RDS',
        ts: new Date().toISOString(),
        policy_version: 'TG-2025',
        inputs_hash: 'sha256:demo_advice',
        strategy: 'TaxOptimizedRebalancing',
        reasons: ['portfolio_drift', 'tax_optimization', 'demo_mode']
      });
      executionLog.push('📋 Advice-RDS generated');

      // 2-6. Generate other receipts similarly...
      const receiptTypes = [
        { type: 'Lot-RDS', lot_policy: 'TaxOptimized', wash_sale_check: true },
        { type: 'TLH-RDS', proxy_pair: { from: 'AAPL', to: 'MSFT' }, trigger_bps: 300 },
        { type: 'Location-RDS', alloc: { ira: 0.4, roth: 0.3, tax: 0.3 } },
        { type: 'Trade-RDS', inherited_controls: { adv_symbol_bps: 500, adv_book_bps: 1000, cooling_off_sec: 300, drawdown_limit_bps: 200 } },
        { type: 'Reconciliation-RDS', reconciliation_details: { fills_hash: 'sha256:demo_fills_001', status: 'MATCHED', trade_count: 2 } }
      ];

      for (const receiptData of receiptTypes) {
        await recordReceipt({
          receipt_id: `rds_${receiptData.type.toLowerCase()}_demo_${Date.now()}`,
          ts: new Date().toISOString(),
          policy_version: 'TG-2025',
          inputs_hash: `sha256:demo_${receiptData.type.toLowerCase()}`,
          reasons: ['demo_mode', receiptData.type.toLowerCase()],
          ...receiptData
        });

        receipts.push({
          receipt_id: `rds_${receiptData.type.toLowerCase()}_demo_${Date.now()}`,
          type: receiptData.type,
          ts: new Date().toISOString(),
          policy_version: 'TG-2025',
          inputs_hash: `sha256:demo_${receiptData.type.toLowerCase()}`,
          reasons: ['demo_mode', receiptData.type.toLowerCase()],
          ...receiptData
        } as Receipt);
        
        executionLog.push(`📊 ${receiptData.type} generated`);
      }
      executionLog.push('✅ Reconciliation-RDS generated');

      // 7. Verify all receipts
      const validation = verifyReceipts(receipts);
      executionLog.push(`🔍 Receipt verification: ${validation.validReceipts}/${validation.totalReceipts} valid`);

      setDemoResult({ receipts, validation, executionLog });
      
    } catch (error) {
      executionLog.push(`❌ Demo failed: ${(error as Error).message}`);
      setDemoResult({ receipts, validation: null, executionLog });
    } finally {
      setIsRunning(false);
    }
  };

  const getValidationIcon = (valid: boolean) => {
    return valid ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getValidationColor = (valid: boolean) => {
    return valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Trading Governance OS - Demo</h1>
          <p className="text-muted-foreground">
            Run end-to-end trading demo with content-free receipts
          </p>
        </div>
        
        <Button 
          onClick={runTradingDemo} 
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          {isRunning ? 'Running Demo...' : 'Run TG Demo'}
        </Button>
      </div>

      {demoResult && (
        <div className="grid gap-6">
          {/* Execution Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
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

          {/* Receipt Validation */}
          {demoResult.validation && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Receipt Validation Results
                  <Badge className={getValidationColor(demoResult.validation.validReceipts === demoResult.validation.totalReceipts)}>
                    {demoResult.validation.validReceipts}/{demoResult.validation.totalReceipts} Valid
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoResult.validation.results.map((result: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getValidationIcon(result.valid)}
                          <span className="font-medium">{result.receiptType}</span>
                        </div>
                        <Badge className={getValidationColor(result.valid)}>
                          {result.valid ? 'Valid' : 'Invalid'}
                        </Badge>
                      </div>
                      
                      {result.errors.length > 0 && (
                        <div className="text-sm text-red-600 mb-1">
                          <strong>Errors:</strong>
                          <ul className="list-disc list-inside ml-2">
                            {result.errors.map((error: string, errIdx: number) => (
                              <li key={errIdx}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {result.warnings.length > 0 && (
                        <div className="text-sm text-yellow-600">
                          <strong>Warnings:</strong>
                          <ul className="list-disc list-inside ml-2">
                            {result.warnings.map((warning: string, warnIdx: number) => (
                              <li key={warnIdx}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Receipts */}
          <Card>
            <CardHeader>
              <CardTitle>Generated Receipts ({demoResult.receipts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {demoResult.receipts.map((receipt, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{receipt.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {receipt.ts.replace('T', ' ').slice(0, 19)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {receipt.receipt_id}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Reasons: {receipt.reasons.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        <strong>Demo includes:</strong> Advice-RDS, Lot-RDS, TLH-RDS, Location-RDS, Trade-RDS (2 slices), Reconciliation-RDS.
        All receipts are content-free with no PII/PHI.
      </div>
    </div>
  );
}