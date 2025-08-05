import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Play, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DiagnosticReport {
  step1_secrets_check: {
    [key: string]: {
      present: boolean;
      value: string | null;
      status: string;
    };
  };
  step2_api_test: {
    success: boolean;
    status_code?: number;
    response_data?: any;
    api_url_used?: string;
    environment_used?: string;
    error?: string;
    message?: string;
  } | null;
  step3_auth_product_check: {
    issue_detected: boolean;
    error_type?: string;
    description: string;
    environment?: string;
    client_id_prefix?: string;
    auth_product_status?: string;
  } | null;
  step4_recommendations: Array<{
    priority: string;
    action: string;
    description: string;
    client_id_prefix?: string;
    example_message?: string;
  }>;
}

export const PlaidDiagnosticRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const { toast } = useToast();

  const runDiagnostic = async () => {
    setIsRunning(true);
    setReport(null);
    setSummary(null);

    try {
      const { data, error } = await supabase.functions.invoke('diagnose-plaid-integration', {});
      
      if (error) {
        throw error;
      }

      if (data.success) {
        setReport(data.diagnostic_report);
        setSummary(data.summary);
        toast({
          title: "Diagnostic Complete",
          description: `Found ${data.summary.blockers_found} critical issues, ${data.summary.next_steps} recommendations`,
        });
      } else {
        throw new Error(data.message || 'Diagnostic failed');
      }
    } catch (error: any) {
      console.error('Diagnostic error:', error);
      toast({
        title: "Diagnostic Failed",
        description: error.message || 'Failed to run diagnostic',
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Message copied for Plaid support",
    });
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <XCircle className="h-5 w-5 text-red-600" />
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variant = priority === 'CRITICAL' ? 'destructive' : 
                   priority === 'HIGH' ? 'default' : 'secondary';
    return <Badge variant={variant}>{priority}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Plaid Integration Diagnostic
          </CardTitle>
          <CardDescription>
            Comprehensive diagnostic to identify Plaid API integration issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runDiagnostic} disabled={isRunning} className="w-full">
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running Diagnostic...' : 'Run Plaid Diagnostic'}
          </Button>

          {summary && (
            <Alert>
              <AlertDescription>
                <strong>Quick Summary:</strong> {summary.secrets_configured}/{summary.total_secrets_needed} secrets configured, 
                API test {summary.api_test_passed ? 'PASSED' : 'FAILED'}, 
                {summary.blockers_found} critical blockers found
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {report && (
        <div className="space-y-4">
          {/* Step 1: Secrets Check */}
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Environment Variables Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(report.step1_secrets_check).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(value.present)}
                      <span className="font-medium">{key}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{value.value || 'Not set'}</span>
                      <Badge variant={value.present ? 'default' : 'destructive'}>
                        {value.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 2: API Test */}
          {report.step2_api_test && (
            <Card>
              <CardHeader>
                <CardTitle>Step 2: API Connection Test</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.step2_api_test.success)}
                    <span className="font-medium">
                      API Test {report.step2_api_test.success ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  
                  {report.step2_api_test.api_url_used && (
                    <p className="text-sm text-muted-foreground">
                      Environment: {report.step2_api_test.environment_used} | 
                      URL: {report.step2_api_test.api_url_used}
                    </p>
                  )}

                  {report.step2_api_test.status_code && (
                    <p className="text-sm">
                      Status Code: <code>{report.step2_api_test.status_code}</code>
                    </p>
                  )}

                  {report.step2_api_test.response_data && (
                    <details className="text-sm">
                      <summary className="cursor-pointer font-medium">Response Details</summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(report.step2_api_test.response_data, null, 2)}
                      </pre>
                    </details>
                  )}

                  {report.step2_api_test.error && (
                    <Alert>
                      <AlertDescription>
                        <strong>Error:</strong> {report.step2_api_test.message || report.step2_api_test.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Auth Product Check */}
          {report.step3_auth_product_check && (
            <Card>
              <CardHeader>
                <CardTitle>Step 3: Auth Product Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(!report.step3_auth_product_check.issue_detected)}
                    <span className="font-medium">
                      {report.step3_auth_product_check.issue_detected ? 'Issue Detected' : 'Auth Product Enabled'}
                    </span>
                  </div>
                  
                  <p className="text-sm">{report.step3_auth_product_check.description}</p>
                  
                  {report.step3_auth_product_check.error_type && (
                    <Badge variant="destructive">{report.step3_auth_product_check.error_type}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Recommendations */}
          {report.step4_recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Recommendations & Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.step4_recommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded space-y-2">
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(rec.priority)}
                        <span className="font-medium">{rec.action}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      
                      {rec.example_message && (
                        <div className="mt-2 p-3 bg-muted rounded">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Example message for Plaid support:</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyToClipboard(rec.example_message!)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                          <p className="text-xs">{rec.example_message}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};