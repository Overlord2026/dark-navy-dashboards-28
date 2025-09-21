
import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Zap, RefreshCw, AlertCircle } from "lucide-react";
import { useCurrentTier } from "@/hooks/useCurrentTier";
import { AggregationGate } from "@/components/ui/AggregationGate";

interface PlaidLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (publicToken: string) => void;
}

export function PlaidLinkDialog({ isOpen, onClose, onSuccess }: PlaidLinkDialogProps) {
  const { toast } = useToast();
  const { tierConfig } = useCurrentTier();
  const [isConnecting, setIsConnecting] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Render state logging removed for production security
  
  // Fetch link token when dialog opens
  useEffect(() => {
    if (isOpen && !linkToken && !error) {
      // Dialog state logging removed for production security
      fetchLinkToken();
    }
  }, [isOpen]);

  const fetchLinkToken = async (isRetry = false) => {
    try {
      setError(null);
      if (isRetry) setIsRetrying(true);
      
      // Token fetch logging removed for production security
      const response = await supabase.functions.invoke('plaid-create-link-token');
      
      if (response.error) {
        const errorMessage = typeof response.error === 'string' 
          ? response.error 
          : response.error?.message || response.error?.details || "Unknown error occurred";
        
        setError(`Failed to initialize Plaid: ${errorMessage}`);
        
        if (!isRetry) {
          toast({
            title: "Plaid Connection Error",
            description: errorMessage,
            variant: "destructive"
          });
        }
        return;
      }
      
      if (!response.data?.link_token) {
        const errorMsg = "No link token received from server";
        // Error logging removed for production security
        setError(errorMsg);
        return;
      }
      
      // Success logging removed for production security
      setLinkToken(response.data.link_token);
      setError(null);
      
    } catch (error) {
      // Error logging removed for production security
      const errorMsg = "Network error. Please check your connection and try again.";
      setError(errorMsg);
      
      if (!isRetry) {
        toast({
          title: "Connection Error",
          description: errorMsg,
          variant: "destructive"
        });
      }
    } finally {
      if (isRetry) setIsRetrying(false);
    }
  };

  const { open: openPlaidLink, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token: string, metadata: any) => {
      // Success callback logging removed for production security
      
      // Don't reopen our dialog on success - let the parent handle the success flow
      onSuccess(public_token);
    },
    onExit: (err: any, metadata: any) => {
      // Exit callback logging removed for production security
      
      if (err != null) {
        // Error logging removed for production security
        setError("Failed to link your accounts. Please try again.");
        toast({
          title: "Connection Error",
          description: "Failed to link your accounts. Please try again.",
          variant: "destructive"
        });
      } else {
        // Exit logging removed for production security
        onClose();
      }
      // Metadata logging removed for production security
      setIsConnecting(false);
    },
    onEvent: (eventName: string, metadata: any) => {
      // Event logging removed for production security
    },
  });

  // Clear loading state when Plaid is ready
  useEffect(() => {
    if (ready && linkToken && isConnecting) {
      // Ready state logging removed for production security
      setIsConnecting(false);
    }
  }, [ready, linkToken, isConnecting]);

  const handleConnect = () => {
    // Connection logging removed for production security
    if (ready && linkToken) {
      // Connection logging removed for production security
      onClose();
      openPlaidLink();
    } else {
      // Loading logging removed for production security
      setIsConnecting(true);
    }
  };

  const handleDialogClose = () => {
    // Close logging removed for production security
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent 
        className="sm:max-w-[500px] bg-card text-foreground border-border p-0 overflow-hidden"
      >
        <DialogTitle className="sr-only">Connect Bank Account with Plaid</DialogTitle>
        <DialogDescription className="sr-only">
          Connect your bank account securely using Plaid to automatically sync your financial data.
        </DialogDescription>
        <div className="relative p-8">
          {!tierConfig.allowAggregation ? (
            <AggregationGate fallbackMessage="Account aggregation requires Premium or Pro plan. Upgrade to connect your bank accounts automatically.">
              <></>
            </AggregationGate>
          ) : (
            <div className="text-center space-y-6">
              {error ? (
                // Error state
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Connection Error</h2>
                    <p className="text-muted-foreground text-sm">{error}</p>
                  </div>
                </div>
              ) : (
                // Normal state
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-foreground">
                    <span className="font-bold">Advanced Wealth Management</span> uses <span className="font-bold">Plaid</span> to connect your account
                  </h2>
                </div>
              )}
              
              {!error && (
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="flex items-start gap-3 text-left">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground">Connect in seconds</h3>
                      <p className="text-muted-foreground text-sm">
                        8000+ apps trust Plaid to quickly connect to financial institutions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-left">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-foreground">Keep your data safe</h3>
                      <p className="text-muted-foreground text-sm">
                        Plaid uses best-in-class encryption to help protect your data
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {!error && (
                <div className="text-xs text-muted-foreground text-center max-w-md mx-auto bg-muted/30 rounded-lg p-3">
                  By continuing, you agree to Plaid's <a href="#" className="underline text-primary hover:text-primary/80">Privacy Policy</a> and to receiving updates on plaid.com
                </div>
              )}
            </div>
          )}
          
          {tierConfig.allowAggregation && (
            <div className="mt-8 space-y-3">
              {error ? (
                <Button 
                  onClick={() => fetchLinkToken(true)}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isRetrying}
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={handleConnect}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isConnecting || !linkToken}
                >
                  {isConnecting ? "Connecting..." : linkToken ? "Continue with Plaid" : "Loading..."}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
