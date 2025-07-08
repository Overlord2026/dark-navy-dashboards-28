import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
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
      console.error("PlaidDebugDialog: Test failed:", error);
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
              onClick={() => {
                console.log("=== FULL PLAID DEBUG INFO ===");
                console.log("Current URL:", window.location.href);
                console.log("User Agent:", navigator.userAgent);
                console.log("Local Storage keys:", Object.keys(localStorage));
                console.log("Session Storage keys:", Object.keys(sessionStorage));
                toast({
                  title: "Debug Info",
                  description: "Check console for debug information"
                });
              }}
              variant="outline"
            >
              Log Debug Info
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}