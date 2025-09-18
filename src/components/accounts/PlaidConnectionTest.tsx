import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export function PlaidConnectionTest() {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const testPlaidConnection = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      console.log("Testing Plaid connection...");
      
      const response = await supabase.functions.invoke('plaid-create-link-token');
      
      console.log("Plaid test response:", response);
      
      if (response.error) {
        setResult({
          success: false,
          message: "Plaid connection failed",
          details: response.error
        });
        
        toast({
          title: "Connection Failed",
          description: typeof response.error === 'string' ? response.error : JSON.stringify(response.error),
          variant: "destructive"
        });
      } else if (response.data?.link_token) {
        setResult({
          success: true,
          message: "Plaid connection successful!",
          details: {
            link_token: response.data.link_token.substring(0, 20) + "...",
            expiration: response.data.expiration
          }
        });
        
        toast({
          title: "Success!",
          description: "Plaid API keys are configured correctly and working"
        });
      } else {
        setResult({
          success: false,
          message: "Unexpected response from Plaid",
          details: response.data
        });
      }
      
    } catch (error) {
      console.error("Test failed:", error);
      setResult({
        success: false,
        message: "Network error during test",
        details: error
      });
      
      toast({
        title: "Test Failed",
        description: `Error: ${error}`,
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {result?.success === true && <CheckCircle className="h-5 w-5 text-green-500" />}
          {result?.success === false && <XCircle className="h-5 w-5 text-red-500" />}
          Plaid Connection Test
        </CardTitle>
        <CardDescription>
          Test your Plaid API credentials to ensure they're working properly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testPlaidConnection}
          disabled={testing}
          className="w-full"
        >
          {testing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            "Test Plaid Connection"
          )}
        </Button>
        
        {result && (
          <div className={`p-3 rounded-md border ${
            result.success 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="font-medium">{result.message}</p>
            {result.details && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm">View Details</summary>
                <pre className="mt-1 text-xs overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}