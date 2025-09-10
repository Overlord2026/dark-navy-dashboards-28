import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_MODE } from '@/config/featureFlags';

export default function LiveModeTest() {
  const [logs, setLogs] = useState<string[]>([]);
  const [tenantId, setTenantId] = useState<string>('');
  const [receipts, setReceipts] = useState<any[]>([]);
  const [replayResults, setReplayResults] = useState<any[]>([]);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'complete'>('idle');

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toISOString().substring(11, 23);
    const prefix = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    setLogs(prev => [...prev, `[${timestamp}] ${prefix} ${message}`]);
  };

  const checkConfiguration = async () => {
    addLog('Checking Live Mode configuration...');
    
    // Check environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const mockMode = import.meta.env.VITE_APP_MOCK_MODE;
    
    addLog(`MOCK_MODE flag: ${MOCK_MODE}`, MOCK_MODE ? 'warning' : 'success');
    addLog(`VITE_APP_MOCK_MODE env: ${mockMode || 'undefined'}`);
    addLog(`VITE_SUPABASE_URL: ${supabaseUrl ? 'Set' : 'Not set'}`, supabaseUrl ? 'success' : 'error');
    addLog(`VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'Set' : 'Not set'}`, supabaseAnonKey ? 'success' : 'error');
    
    if (MOCK_MODE) {
      addLog('WARNING: Application is running in MOCK_MODE. Switch to Live Mode to test RPCs.', 'warning');
      return false;
    }
    
    return true;
  };

  const testTenantCreation = async () => {
    try {
      addLog('Testing tenant creation via ensure_user_tenant()...');
      
      const { data, error } = await supabase.rpc('ensure_user_tenant');
      
      if (error) {
        addLog(`ensure_user_tenant() failed: ${error.message}`, 'error');
        return null;
      }
      
      const tenant = data as string;
      setTenantId(tenant);
      addLog(`✅ Tenant created/found: ${tenant}`, 'success');
      return tenant;
      
    } catch (error) {
      addLog(`Exception in ensure_user_tenant(): ${error}`, 'error');
      return null;
    }
  };

  const listReceipts = async () => {
    try {
      addLog('Listing receipts from aies_receipts table...');
      
      const { data, error } = await supabase
        .from('aies_receipts')
        .select('id, created_at, inputs, outcomes, reason_codes')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        addLog(`Failed to list receipts: ${error.message}`, 'error');
        return [];
      }
      
      setReceipts(data || []);
      addLog(`Found ${data?.length || 0} receipts`, 'success');
      return data || [];
      
    } catch (error) {
      addLog(`Exception listing receipts: ${error}`, 'error');
      return [];
    }
  };

  const testReplayRPCs = async () => {
    try {
      addLog('Testing replay RPC functions...');
      
      // Create mock receipt IDs for testing
      const testReceiptId = '00000000-0000-0000-0000-000000000001';
      const results = [];
      
      // Test replay_verify_voice
      try {
        addLog('Testing replay_verify_voice RPC...');
        const { data: voiceData, error: voiceError } = await supabase.rpc('replay_verify_voice', {
          p_receipt: testReceiptId
        });
        
        if (voiceError) {
          addLog(`replay_verify_voice error: ${voiceError.message}`, 'error');
          results.push({ rpc: 'replay_verify_voice', status: 'FAIL', error: voiceError.message });
        } else {
          addLog(`replay_verify_voice result: ${JSON.stringify(voiceData)}`, 'success');
          results.push({ rpc: 'replay_verify_voice', status: 'PASS', data: voiceData });
        }
      } catch (error) {
        addLog(`replay_verify_voice exception: ${error}`, 'error');
        results.push({ rpc: 'replay_verify_voice', status: 'FAIL', error: String(error) });
      }

      // Test replay_verify_401k
      try {
        addLog('Testing replay_verify_401k RPC...');
        const { data: k401Data, error: k401Error } = await supabase.rpc('replay_verify_401k', {
          p_receipt: testReceiptId
        });
        
        if (k401Error) {
          addLog(`replay_verify_401k error: ${k401Error.message}`, 'error');
          results.push({ rpc: 'replay_verify_401k', status: 'FAIL', error: k401Error.message });
        } else {
          addLog(`replay_verify_401k result: ${JSON.stringify(k401Data)}`, 'success');
          results.push({ rpc: 'replay_verify_401k', status: 'PASS', data: k401Data });
        }
      } catch (error) {
        addLog(`replay_verify_401k exception: ${error}`, 'error');
        results.push({ rpc: 'replay_verify_401k', status: 'FAIL', error: String(error) });
      }

      // Test replay_verify_creator
      try {
        addLog('Testing replay_verify_creator RPC...');
        const { data: creatorData, error: creatorError } = await supabase.rpc('replay_verify_creator', {
          p_receipt: testReceiptId
        });
        
        if (creatorError) {
          addLog(`replay_verify_creator error: ${creatorError.message}`, 'error');
          results.push({ rpc: 'replay_verify_creator', status: 'FAIL', error: creatorError.message });
        } else {
          addLog(`replay_verify_creator result: ${JSON.stringify(creatorData)}`, 'success');
          results.push({ rpc: 'replay_verify_creator', status: 'PASS', data: creatorData });
        }
      } catch (error) {
        addLog(`replay_verify_creator exception: ${error}`, 'error');
        results.push({ rpc: 'replay_verify_creator', status: 'FAIL', error: String(error) });
      }

      setReplayResults(results);
      return results;
      
    } catch (error) {
      addLog(`Exception in replay RPC tests: ${error}`, 'error');
      return [];
    }
  };

  const runAllTests = async () => {
    setTestStatus('running');
    setLogs([]);
    setReplayResults([]);
    
    addLog('Starting Live Mode verification tests...');
    
    // Step 1: Check configuration
    const configOk = await checkConfiguration();
    if (!configOk) {
      setTestStatus('complete');
      return;
    }
    
    // Step 2: Test tenant creation
    const tenant = await testTenantCreation();
    if (!tenant) {
      setTestStatus('complete');
      return;
    }
    
    // Step 3: List receipts
    await listReceipts();
    
    // Step 4: Test replay RPCs
    const rpcResults = await testReplayRPCs();
    
    // Final report
    const passCount = rpcResults.filter(r => r.status === 'PASS').length;
    const failCount = rpcResults.filter(r => r.status === 'FAIL').length;
    
    addLog(`Live Mode test completed: ${passCount} PASS, ${failCount} FAIL`, 
           failCount === 0 ? 'success' : 'warning');
    
    setTestStatus('complete');
  };

  const clearLogs = () => {
    setLogs([]);
    setReplayResults([]);
    setReceipts([]);
    setTenantId('');
    setTestStatus('idle');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Live Mode Verification</h1>
        <p className="text-muted-foreground">Test Supabase connectivity and replay RPC functions</p>
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Configuration Status
            <Badge variant={MOCK_MODE ? "destructive" : "default"}>
              {MOCK_MODE ? "Mock Mode" : "Live Mode"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>MOCK_MODE:</strong> {MOCK_MODE ? 'true' : 'false'}
            </div>
            <div>
              <strong>Supabase URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing'}
            </div>
            <div>
              <strong>Supabase Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured' : 'Missing'}
            </div>
            <div>
              <strong>Tenant ID:</strong> {tenantId || 'Not set'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex gap-4">
        <Button 
          onClick={runAllTests} 
          disabled={testStatus === 'running'}
          variant="default"
        >
          {testStatus === 'running' ? 'Running Tests...' : 'Run Live Mode Tests'}
        </Button>
        <Button onClick={clearLogs} variant="outline">
          Clear Results
        </Button>
      </div>

      {/* Receipts Summary */}
      {receipts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Receipts Found ({receipts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {receipts.slice(0, 3).map((receipt, index) => (
                <div key={index} className="text-sm border rounded p-2">
                  <div><strong>ID:</strong> {receipt.id}</div>
                  <div><strong>Created:</strong> {receipt.created_at}</div>
                  <div><strong>Inputs:</strong> {JSON.stringify(receipt.inputs)}</div>
                </div>
              ))}
              {receipts.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  ... and {receipts.length - 3} more receipts
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* RPC Test Results */}
      {replayResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>RPC Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {replayResults.map((result, index) => (
                <div key={index} className="border rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <strong>{result.rpc}</strong>
                    <Badge variant={result.status === 'PASS' ? 'default' : 'destructive'}>
                      {result.status}
                    </Badge>
                  </div>
                  {result.error && (
                    <div className="text-red-600 text-sm mb-2">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                  {result.data && (
                    <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Logs */}
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