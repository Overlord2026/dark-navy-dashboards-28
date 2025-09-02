import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle, Play, Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';

interface ReadinessResult {
  routes_ok: boolean;
  receipts_ok: boolean;
  anchors_ok: boolean;
  policy_compliance: boolean;
  timestamp: string;
  details?: string;
}

export function FamiliesReadinessButton() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ReadinessResult | null>(null);

  const runReadinessCheck = async () => {
    setIsRunning(true);
    try {
      // Simulate policy evaluation call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock readiness result - in real implementation would call policy-eval edge function
      const mockResult: ReadinessResult = {
        routes_ok: true,
        receipts_ok: true,
        anchors_ok: true,
        policy_compliance: true,
        timestamp: new Date().toISOString(),
        details: 'All families systems operational'
      };
      
      setResult(mockResult);
      toast.ok('Families readiness check completed');
    } catch (error) {
      toast.err('Readiness check failed');
      setResult({
        routes_ok: false,
        receipts_ok: false,
        anchors_ok: false,
        policy_compliance: false,
        timestamp: new Date().toISOString(),
        details: 'Check failed with errors'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getOverallStatus = (): 'green' | 'amber' | 'red' => {
    if (!result) return 'amber';
    const allPass = result.routes_ok && result.receipts_ok && result.anchors_ok && result.policy_compliance;
    const mostPass = [result.routes_ok, result.receipts_ok, result.anchors_ok, result.policy_compliance].filter(Boolean).length >= 3;
    
    if (allPass) return 'green';
    if (mostPass) return 'amber';
    return 'red';
  };

  const getStatusIcon = (status: 'green' | 'amber' | 'red') => {
    switch (status) {
      case 'green': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'amber': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'red': return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: 'green' | 'amber' | 'red') => {
    const colors = {
      green: 'bg-green-50 text-green-700 border-green-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200',
      red: 'bg-red-50 text-red-700 border-red-200'
    };
    
    return (
      <Badge variant="outline" className={`gap-1 ${colors[status]}`}>
        {getStatusIcon(status)}
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={runReadinessCheck}
        disabled={isRunning}
        className="gap-2"
        size="sm"
      >
        {isRunning ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        {isRunning ? 'Running Readiness...' : 'Run Readiness'}
      </Button>

      {result && (
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              Families Readiness Status
              {getStatusBadge(getOverallStatus())}
            </CardTitle>
            <CardDescription className="text-xs">
              Last checked: {new Date(result.timestamp).toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Routes</span>
                <span className={result.routes_ok ? 'text-green-600' : 'text-red-600'}>
                  {result.routes_ok ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Receipts</span>
                <span className={result.receipts_ok ? 'text-green-600' : 'text-red-600'}>
                  {result.receipts_ok ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Anchors</span>
                <span className={result.anchors_ok ? 'text-green-600' : 'text-red-600'}>
                  {result.anchors_ok ? '✅' : '❌'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Policy</span>
                <span className={result.policy_compliance ? 'text-green-600' : 'text-red-600'}>
                  {result.policy_compliance ? '✅' : '❌'}
                </span>
              </div>
            </div>
            {result.details && (
              <p className="text-xs text-muted-foreground mt-2">{result.details}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}