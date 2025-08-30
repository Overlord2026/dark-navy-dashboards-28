import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { runNilSmokeTests } from '@/scripts/runNilSmokeTests';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';

export function NilSmokeTestRunner() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const handleRunTests = async () => {
    setRunning(true);
    setResults(null);
    
    try {
      const testResults = await runNilSmokeTests();
      setResults(testResults);
      setLastRun(new Date());
    } catch (error) {
      setResults({
        passed: 0,
        failed: 1,
        total: 1,
        tests: [{ name: 'Test Runner', status: 'fail', error: `Test execution failed: ${error}` }]
      });
    } finally {
      setRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'fail': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  return (
    <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
      <CardHeader className="border-b border-bfo-gold/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white font-semibold flex items-center space-x-2">
              <Play className="h-5 w-5 text-bfo-gold" />
              <span>NIL Smoke Tests</span>
            </CardTitle>
            <CardDescription className="text-white/70">
              Automated safety nets for NIL demo functionality
            </CardDescription>
          </div>
          
          {lastRun && (
            <Badge variant="outline" className="border-bfo-gold/40 text-bfo-gold">
              Last run: {lastRun.toLocaleTimeString()}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Run Button */}
        <div className="flex space-x-2">
          <GoldButton 
            onClick={handleRunTests} 
            disabled={running}
            className="flex items-center space-x-2"
          >
            {running ? <Clock className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            <span>{running ? 'Running Tests...' : 'Run Smoke Tests'}</span>
          </GoldButton>
          
          <GoldOutlineButton 
            onClick={() => window.open('/nil/demo?no_anchor=1', '_blank')}
            className="flex items-center space-x-2"
          >
            <span>Open NIL Demo</span>
          </GoldOutlineButton>
        </div>

        {/* Test Results */}
        {results && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-bfo-black/30 border border-bfo-gold/20">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{results.passed}</div>
                  <div className="text-xs text-white/60">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{results.failed}</div>
                  <div className="text-xs text-white/60">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bfo-gold">{results.total}</div>
                  <div className="text-xs text-white/60">Total</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-semibold text-bfo-gold">
                  {Math.round((results.passed / results.total) * 100)}%
                </div>
                <div className="text-xs text-white/60">Success Rate</div>
              </div>
            </div>

            {/* Individual Test Results */}
            <div className="space-y-2">
              <h4 className="text-white font-medium">Test Details:</h4>
              {results.tests.map((test: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-bfo-black/20 border border-bfo-gold/10"
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <span className="text-white">{test.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(test.status)}>
                      {test.status.toUpperCase()}
                    </Badge>
                    
                    {test.error && (
                      <div className="text-xs text-red-400 max-w-xs truncate" title={test.error}>
                        <AlertTriangle className="h-3 w-3 inline mr-1" />
                        {test.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Quick Actions */}
            {results.failed > 0 && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Some tests failed. Check NIL demo functionality.</span>
                </div>
                <div className="mt-2 space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open('/nil/demo', '_blank')}
                    className="text-xs"
                  >
                    Reset Demo
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleRunTests}
                    className="text-xs"
                  >
                    Retry Tests
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Test Information */}
        <div className="p-3 rounded-lg bg-bfo-gold/10 border border-bfo-gold/30">
          <div className="text-xs text-bfo-gold/80 space-y-1">
            <p><strong>Tests Include:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Demo reset & fixture loading</li>
              <li>• Education module completion (3/3)</li>
              <li>• Offer creation & receipt generation</li>
              <li>• System health & fallback modes</li>
              <li>• End-to-end presenter flow (90s script)</li>
            </ul>
            <p className="mt-2">
              <strong>Note:</strong> Tests run in headless mode with no external dependencies.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}