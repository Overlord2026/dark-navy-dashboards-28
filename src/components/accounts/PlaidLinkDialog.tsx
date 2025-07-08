
import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Shield, Zap, RefreshCw, AlertCircle } from "lucide-react";

interface PlaidLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (publicToken: string) => void;
}

export function PlaidLinkDialog({ isOpen, onClose, onSuccess }: PlaidLinkDialogProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  console.log("PlaidLinkDialog: Rendering with state", { isOpen, linkToken, isConnecting, error });
  
  // Fetch link token when dialog opens
  useEffect(() => {
    if (isOpen && !linkToken && !error) {
      console.log("PlaidLinkDialog: Dialog opened, fetching link token");
      fetchLinkToken();
    }
  }, [isOpen]);

  const fetchLinkToken = async (isRetry = false) => {
    try {
      setError(null);
      if (isRetry) setIsRetrying(true);
      
      console.log("PlaidLinkDialog: Starting fetchLinkToken", { isRetry });
      const response = await supabase.functions.invoke('plaid-create-link-token');
      
      console.log("PlaidLinkDialog: Full response", response);
      console.log("PlaidLinkDialog: Link token response", { data: response.data, error: response.error });
      
      if (response.error) {
        console.error('Error creating link token:', response.error);
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
        console.error('PlaidLinkDialog:', errorMsg);
        setError(errorMsg);
        return;
      }
      
      console.log("PlaidLinkDialog: Setting link token successfully");
      setLinkToken(response.data.link_token);
      setError(null);
      
    } catch (error) {
      console.error('Error fetching link token:', error);
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
      console.log('PlaidLinkDialog: Plaid Link success callback triggered');
      console.log('PlaidLinkDialog: Public token received:', public_token?.substring(0, 20) + '...');
      console.log('PlaidLinkDialog: Metadata:', metadata);
      
      // Close the dialog first
      onClose();
      
      // Call the success handler
      onSuccess(public_token);
    },
    onExit: (err: any, metadata: any) => {
      console.log('PlaidLinkDialog: Plaid Link exit callback triggered');
      if (err != null) {
        console.error('PlaidLinkDialog: Plaid Link error:', err);
        toast({
          title: "Connection Error",
          description: "Failed to link your accounts. Please try again.",
          variant: "destructive"
        });
      } else {
        console.log('PlaidLinkDialog: User exited Plaid Link without error');
      }
      console.log('PlaidLinkDialog: Exit metadata:', metadata);
    },
    onEvent: (eventName: string, metadata: any) => {
      console.log('PlaidLinkDialog: Plaid Link event:', eventName, metadata);
    },
  });

  // Clear loading state when Plaid is ready
  useEffect(() => {
    if (ready && linkToken && isConnecting) {
      console.log("PlaidLinkDialog: Plaid is ready, clearing loading state");
      setIsConnecting(false);
    }
  }, [ready, linkToken, isConnecting]);

  const handleConnect = () => {
    console.log("PlaidLinkDialog: handleConnect called", { ready, linkToken });
    if (ready && linkToken) {
      console.log("PlaidLinkDialog: Opening Plaid Link");
      // Don't close our dialog immediately - let Plaid handle the flow
      openPlaidLink();
    } else {
      console.log("PlaidLinkDialog: Not ready, showing loading state");
      setIsConnecting(true);
      // The token fetch is already in progress, just wait for it
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card text-foreground border-border p-0 overflow-hidden">
        <div className="relative p-8">
          
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
