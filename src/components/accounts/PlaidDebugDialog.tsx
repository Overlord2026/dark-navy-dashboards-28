import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBankAccounts } from "@/context/BankAccountsContext";

interface PlaidDebugDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlaidDebugDialog({ isOpen, onClose }: PlaidDebugDialogProps) {
  const { toast } = useToast();
  const { refreshAccounts } = useBankAccounts();
  const [testing, setTesting] = useState(false);

  const testPlaidConnection = async () => {
    setTesting(true);
    try {
      console.log("PlaidDebugDialog: Testing Plaid connection...");
      
      // Test link token creation
      console.log("PlaidDebugDialog: Testing link token creation...");
      const linkTokenResponse = await supabase.functions.invoke('plaid-create-link-token');
      
      console.log("PlaidDebugDialog: Link token response:", linkTokenResponse);
      
      if (linkTokenResponse.error) {
        toast({
          title: "Link Token Failed",
          description: `Error: ${JSON.stringify(linkTokenResponse.error)}`,
          variant: "destructive"
        });
        return;
      }
      
      if (linkTokenResponse.data?.link_token) {
        toast({
          title: "Link Token Success",
          description: "Plaid link token created successfully"
        });
      }
      
    } catch (error) {
      // Error logging removed for production security
      toast({
        title: "Test Failed",
        description: `Error: ${error}`,
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const refreshAccountsManually = async () => {
    try {
      console.log("PlaidDebugDialog: Manually refreshing accounts...");
      await refreshAccounts();
      toast({
        title: "Refresh Complete",
        description: "Accounts have been refreshed"
      });
    } catch (error) {
      console.error("PlaidDebugDialog: Refresh failed:", error);
      toast({
        title: "Refresh Failed",
        description: `Error: ${error}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Plaid Connection Debug</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use these tools to debug Plaid integration issues.
          </p>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={testPlaidConnection}
              disabled={testing}
              variant="outline"
            >
              {testing ? "Testing..." : "Test Plaid Connection"}
            </Button>
            
            <Button 
              onClick={refreshAccountsManually}
              variant="outline"
            >
              Refresh Accounts Manually
            </Button>
            
            <Button 
              onClick={async () => {
                try {
                  console.log("Testing plaid-exchange-public-token function directly...");
                  const testResponse = await supabase.functions.invoke('plaid-exchange-public-token', {
                    body: { 
                      public_token: 'test-public-token-for-debugging' 
                    }
                  });
                  console.log("Exchange function test response:", testResponse);
                  
                  toast({
                    title: "Exchange Function Test",
                    description: `Response: ${testResponse.error ? 'Error' : 'Success'} - Check console for details`
                  });
                } catch (error) {
                  console.error("Exchange function test failed:", error);
                  toast({
                    title: "Exchange Function Test Failed",
                    description: `Error: ${error}`,
                    variant: "destructive"
                  });
                }
              }}
              variant="outline"
            >
              Test Exchange Function
            </Button>
            
            <Button 
              onClick={async () => {
                console.log("=== FULL PLAID DEBUG INFO ===");
                console.log("Current URL:", window.location.href);
                console.log("User Agent:", navigator.userAgent);
                console.log("Local Storage keys:", Object.keys(localStorage));
                console.log("Session Storage keys:", Object.keys(sessionStorage));
                
                // Test edge function connectivity
                try {
                  console.log("Testing edge function connectivity...");
                  const testResponse = await supabase.functions.invoke('plaid-exchange-public-token', {
                    body: { test: true }
                  });
                  console.log("Edge function test response:", testResponse);
                } catch (error) {
                  console.error("Edge function test failed:", error);
                }
                
                toast({
                  title: "Debug Info",
                  description: "Check console for detailed debug information"
                });
              }}
              variant="outline"
            >
              Log Debug Info & Test Functions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}