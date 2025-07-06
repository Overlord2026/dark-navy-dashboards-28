
import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Shield, Zap } from "lucide-react";

interface PlaidLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (publicToken: string) => void;
}

export function PlaidLinkDialog({ isOpen, onClose, onSuccess }: PlaidLinkDialogProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);

  console.log("PlaidLinkDialog: Rendering with state", { isOpen, linkToken, isConnecting });
  
  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      console.log("PlaidLinkDialog: Dialog opened, resetting state");
      setLinkToken(null);
      setIsConnecting(false);
    }
  }, [isOpen]);

  // Fetch link token when dialog opens
  useEffect(() => {
    console.log("PlaidLinkDialog: useEffect triggered", { isOpen, linkToken });
    if (isOpen && !linkToken) {
      console.log("PlaidLinkDialog: Calling fetchLinkToken");
      fetchLinkToken();
    }
  }, [isOpen, linkToken]);

  const fetchLinkToken = async () => {
    try {
      console.log("PlaidLinkDialog: Starting fetchLinkToken");
      setIsConnecting(true);
      const response = await supabase.functions.invoke('plaid-create-link-token');
      
      console.log("PlaidLinkDialog: Full response", response);
      console.log("PlaidLinkDialog: Link token response", { data: response.data, error: response.error });
      
      if (response.error) {
        console.error('Error creating link token:', response.error);
        toast({
          title: "Plaid Connection Error",
          description: response.error.message || "Failed to initialize Plaid connection. Please try again or contact support.",
          variant: "destructive"
        });
        return;
      }
      
      console.log("PlaidLinkDialog: Setting link token", response.data?.link_token);
      setLinkToken(response.data?.link_token);
    } catch (error) {
      console.error('Error fetching link token:', error);
      toast({
        title: "Error",
        description: "Failed to initialize Plaid connection",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const { open: openPlaidLink, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token: string, metadata: any) => {
      console.log('Plaid Link success:', { public_token, metadata });
      toast({
        title: "Success",
        description: "Your accounts have been successfully linked"
      });
      onSuccess(public_token);
      onClose();
    },
    onExit: (err: any, metadata: any) => {
      if (err != null) {
        console.error('Plaid Link error:', err);
        toast({
          title: "Connection Error",
          description: "Failed to link your accounts. Please try again.",
          variant: "destructive"
        });
      }
    },
    onEvent: (eventName: string, metadata: any) => {
      console.log('Plaid Link event:', eventName, metadata);
    },
  });

  const handleConnect = () => {
    console.log("PlaidLinkDialog: handleConnect called", { ready, linkToken });
    if (ready && linkToken) {
      console.log("PlaidLinkDialog: Opening Plaid Link");
      openPlaidLink();
    } else {
      console.log("PlaidLinkDialog: Fetching link token");
      fetchLinkToken();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card text-foreground border-border p-0 overflow-hidden">
        <div className="relative p-8">
          
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                <span className="font-bold">Advanced Wealth Management</span> uses <span className="font-bold">Plaid</span> to connect your account
              </h2>
            </div>
            
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
            
            <div className="text-xs text-muted-foreground text-center max-w-md mx-auto bg-muted/30 rounded-lg p-3">
              By continuing, you agree to Plaid's <a href="#" className="underline text-primary hover:text-primary/80">Privacy Policy</a> and to receiving updates on plaid.com
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              onClick={handleConnect}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Continue with Plaid"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
