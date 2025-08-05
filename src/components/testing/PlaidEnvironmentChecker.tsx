import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Play, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const PlaidEnvironmentChecker: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const checkEnvironment = async () => {
    setIsChecking(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('check-plaid-environment', {});
      
      if (error) {
        throw error;
      }

      setResult(data);
      toast({
        title: "Environment Check Complete",
        description: data.PLAID_ENVIRONMENT_SET ? "Environment configured" : "Environment variable missing",
        variant: data.PLAID_ENVIRONMENT_SET ? "default" : "destructive"
      });
    } catch (error: any) {
      console.error('Environment check error:', error);
      toast({
        title: "Check Failed",
        description: error.message || 'Failed to check environment',
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const copyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Plaid Environment Diagnostic
        </CardTitle>
        <CardDescription>
          Check if PLAID_ENVIRONMENT is properly configured
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkEnvironment} disabled={isChecking} className="w-full">
          <Play className="h-4 w-4 mr-2" />
          {isChecking ? 'Checking...' : 'Check Environment Setup'}
        </Button>

        {result && (
          <div className="space-y-4">
            {/* Environment Status */}
            <Alert className={result.PLAID_ENVIRONMENT_SET ? 'border-green-200' : 'border-red-200'}>
              <AlertDescription>
                <div className="flex items-center gap-2 mb-2">
                  {result.PLAID_ENVIRONMENT_SET ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <strong>PLAID_ENVIRONMENT Status:</strong>
                  <Badge variant={result.PLAID_ENVIRONMENT_SET ? 'default' : 'destructive'}>
                    {result.environment_status}
                  </Badge>
                </div>
                <p className="text-sm">Current value: <code>{result.PLAID_ENVIRONMENT_VALUE}</code></p>
              </AlertDescription>
            </Alert>

            {/* Credentials Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-3 border rounded">
                {result.PLAID_CLIENT_ID_SET ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <div className="text-sm">
                  <div className="font-medium">CLIENT_ID</div>
                  <div className="text-muted-foreground">
                    {result.client_id_prefix || 'Not set'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 border rounded">
                {result.PLAID_SECRET_KEY_SET ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <div className="text-sm">
                  <div className="font-medium">SECRET_KEY</div>
                  <div className="text-muted-foreground">
                    {result.PLAID_SECRET_KEY_SET ? 'Configured' : 'Not set'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 border rounded">
                {result.PLAID_ENVIRONMENT_SET ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <div className="text-sm">
                  <div className="font-medium">ENVIRONMENT</div>
                  <div className="text-muted-foreground">
                    {result.PLAID_ENVIRONMENT_VALUE}
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Analysis */}
            {result.issue_analysis && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Issue Analysis:</strong> {result.issue_analysis.likely_issue}
                </AlertDescription>
              </Alert>
            )}

            {/* Recommended Actions */}
            {result.recommended_actions && result.recommended_actions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Recommended Actions:</h4>
                {result.recommended_actions.map((action: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={action.priority === 'CRITICAL' ? 'destructive' : 'default'}>
                        {action.priority}
                      </Badge>
                      <span className="font-medium">{action.action}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                    
                    {action.action === 'SET_PLAID_ENVIRONMENT' && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href="https://supabase.com/dashboard/project/xcmqjkvyvuhoslbzmlgi/settings/functions" 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Add to Supabase Secrets
                          </a>
                        </Button>
                        <code className="text-xs px-2 py-1 bg-muted rounded">
                          PLAID_ENVIRONMENT = production
                        </code>
                      </div>
                    )}

                    {action.message_template && (
                      <div className="mt-3 p-3 bg-muted rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Message for Plaid Support:</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => copyMessage(action.message_template)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <pre className="text-xs whitespace-pre-wrap">{action.message_template}</pre>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};