import React, { useState } from 'react';
import { canonicalize, inputsHash } from '@/lib/canonical';
import { emitReceipt, listReceipts, replay } from '@/lib/dataAdapter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MockTest() {
  const [canonResult, setCanonResult] = useState<string>('');
  const [hashResult, setHashResult] = useState<string>('');
  const [replayResults, setReplayResults] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  // Test 1: Canon page hash test
  const runCanonTest = async () => {
    try {
      const testObj = { z: 2, a: "Á", when: "2025-09-06T12:00:00Z" };
      addLog('Running canonicalization test...');
      
      const canonical = canonicalize(testObj);
      setCanonResult(canonical);
      addLog(`Canonical JSON: ${canonical}`);
      
      const hash = await inputsHash(testObj);
      setHashResult(hash);
      addLog(`SHA-256 Hash: ${hash}`);
      
      // Verify stability by running again
      const canonical2 = canonicalize(testObj);
      const hash2 = await inputsHash(testObj);
      
      if (canonical === canonical2 && hash === hash2) {
        addLog('✅ PASS: Canonical JSON and hash are stable');
      } else {
        addLog('❌ FAIL: Canonical JSON or hash not stable');
      }
    } catch (error) {
      addLog(`❌ FAIL: Canon test error: ${error}`);
    }
  };

  // Test 2: Evidence HUD mock emission and replay
  const runEvidenceTest = async () => {
    try {
      addLog('Starting Evidence HUD test...');
      
      // Emit test RDS receipts
      const mockReceipts = [
        { id: 'voice_test_1', type: 'Voice_RDS', created_at: new Date().toISOString(), value: { session_id: 'test_voice' }, family: 'voice' },
        { id: 'fee_test_1', type: 'FeeCompare_RDS', created_at: new Date().toISOString(), value: { comparison: 'test_fee' }, family: 'trading' },
        { id: 'splits_test_1', type: 'Splits_RDS', created_at: new Date().toISOString(), value: { splits: 'test_splits' }, family: 'creator' }
      ];

      // Emit each receipt
      for (const receipt of mockReceipts) {
        await emitReceipt(receipt);
        addLog(`Emitted ${receipt.type} receipt`);
      }

      // Replay each receipt
      const results = [];
      for (const receipt of mockReceipts) {
        try {
          const replayResult = await replay(receipt.family || 'general', receipt.id);
          results.push({ receipt: receipt.type, result: replayResult });
          
          if (replayResult.ok) {
            addLog(`✅ PASS: ${receipt.type} replay returned { ok: true }`);
          } else {
            addLog(`❌ FAIL: ${receipt.type} replay returned { ok: false }`);
          }
        } catch (error) {
          results.push({ receipt: receipt.type, error: error.message });
          addLog(`❌ FAIL: ${receipt.type} replay error: ${error}`);
        }
      }
      
      setReplayResults(results);
      addLog('Evidence HUD test completed');
      
    } catch (error) {
      addLog(`❌ FAIL: Evidence test error: ${error}`);
    }
  };

  const runAllTests = async () => {
    setLogs([]);
    setReplayResults([]);
    addLog('Starting Mock Mode end-to-end verification...');
    
    await runCanonTest();
    await runEvidenceTest();
    
    addLog('All tests completed!');
  };

  const clearLogs = () => {
    setLogs([]);
    setReplayResults([]);
    setCanonResult('');
    setHashResult('');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Mock Mode Verification</h1>
        <p className="text-muted-foreground">End-to-end testing of canonicalization and mock RDS replay</p>
      </div>

      <div className="flex gap-4">
        <Button onClick={runAllTests} variant="default">
          Run All Tests
        </Button>
        <Button onClick={runCanonTest} variant="outline">
          Test Canon Only
        </Button>
        <Button onClick={runEvidenceTest} variant="outline">
          Test Evidence Only
        </Button>
        <Button onClick={clearLogs} variant="secondary">
          Clear Logs
        </Button>
      </div>

      {/* Canon Test Results */}
      {canonResult && (
        <Card>
          <CardHeader>
            <CardTitle>Canonicalization Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>Input:</strong> {JSON.stringify({ z: 2, a: "Á", when: "2025-09-06T12:00:00Z" })}
              </div>
              <div>
                <strong>Canonical JSON:</strong>
                <pre className="mt-1 p-2 bg-muted rounded text-sm">{canonResult}</pre>
              </div>
              <div>
                <strong>SHA-256 Hash:</strong>
                <pre className="mt-1 p-2 bg-muted rounded text-sm font-mono">{hashResult}</pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Replay Results */}
      {replayResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Replay Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {replayResults.map((result, index) => (
                <div key={index} className="border rounded p-3">
                  <div className="font-medium">{result.receipt}</div>
                  {result.error ? (
                    <div className="text-red-600 text-sm">Error: {result.error}</div>
                  ) : (
                    <pre className="text-xs bg-muted p-2 rounded mt-2">
                      {JSON.stringify(result.result, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Test Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Run tests to see results.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}