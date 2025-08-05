import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const PlaidSecretTester: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const testSecrets = async () => {
    setIsTesting(true);
    setResults(null);

    try {
      console.log('Testing Plaid secrets...');
      
      // Test each secret individually
      const secrets = ['PLAID_CLIENT_ID', 'PLAID_SECRET_KEY', 'PLAID_ENVIRONMENT'];
      const testResults: any = {};

      for (const secret of secrets) {
        try {
          const { data, error } = await supabase.functions.invoke('check-api-keys', {
            body: { secretName: secret }
          });
          
          testResults[secret] = {
            exists: data?.exists || false,
            message: data?.message || error?.message || 'Unknown error',
            error: error
          };
          
          console.log(`${secret}:`, testResults[secret]);
        } catch (err) {
          console.error(`Error testing ${secret}:`, err);
          testResults[secret] = {
            exists: false,
            message: `Error testing secret: ${err}`,
            error: err
          };
        }
      }

      // Also test the environment checker
      try {
        const { data: envData, error: envError } = await supabase.functions.invoke('check-plaid-environment', {});
        testResults['ENVIRONMENT_CHECK'] = {
          success: !envError,
          data: envData,
          error: envError
        };
        console.log('Environment check result:', testResults['ENVIRONMENT_CHECK']);
      } catch (err) {
        console.error('Environment check error:', err);
        testResults['ENVIRONMENT_CHECK'] = {
          success: false,
          error: err
        };
      }

      setResults(testResults);
      
      const environmentExists = testResults['PLAID_ENVIRONMENT']?.exists;
      toast({
        title: environmentExists ? "Environment Variable Found!" : "Environment Variable Still Missing",
        description: environmentExists 
          ? "PLAID_ENVIRONMENT is now configured" 
          : "PLAID_ENVIRONMENT may need more time to propagate",
        variant: environmentExists ? "default" : "destructive"
      });

    } catch (error: any) {
      console.error('Secret test error:', error);
      toast({
        title: "Test Failed",
        description: error.message || 'Failed to test secrets',
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Live Secret Test
        </CardTitle>
        <CardDescription>
          Test if PLAID_ENVIRONMENT is available in edge functions right now
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testSecrets} disabled={isTesting} className="w-full">
          <RefreshCw className={`h-4 w-4 mr-2 ${isTesting ? 'animate-spin' : ''}`} />
          {isTesting ? 'Testing Secrets...' : 'Test All Plaid Secrets Now'}
        </Button>

        {results && (
          <div className="space-y-3">
            <h4 className="font-medium">Real-time Secret Status:</h4>
            
            {['PLAID_CLIENT_ID', 'PLAID_SECRET_KEY', 'PLAID_ENVIRONMENT'].map((secret) => (
              <Alert key={secret} className={results[secret]?.exists ? 'border-green-200' : 'border-red-200'}>
                <AlertDescription>
                  <div className="flex items-center gap-2">
                    {results[secret]?.exists ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <strong>{secret}:</strong>
                    <span className={results[secret]?.exists ? 'text-green-700' : 'text-red-700'}>
                      {results[secret]?.message}
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            ))}

            {results['ENVIRONMENT_CHECK'] && (
              <Alert className="mt-4">
                <AlertDescription>
                  <strong>Environment Check Result:</strong>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(results['ENVIRONMENT_CHECK'].data, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            )}

            {!results['PLAID_ENVIRONMENT']?.exists && (
              <Alert className="border-yellow-200">
                <AlertDescription>
                  <strong>Troubleshooting Tips:</strong>
                  <ul className="mt-2 text-sm space-y-1">
                    <li>• Edge function secrets can take 30-60 seconds to propagate</li>
                    <li>• Try refreshing the Supabase dashboard and check if the secret shows up</li>
                    <li>• Make sure you saved it as "PLAID_ENVIRONMENT" (case-sensitive)</li>
                    <li>• Try adding it again if it's still not showing</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};