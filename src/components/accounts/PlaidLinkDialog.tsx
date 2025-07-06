
import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import { 
  Dialog, 
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, ExternalLink, Shield, Zap, X } from "lucide-react";

interface PlaidLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (publicToken: string) => void;
}

export function PlaidLinkDialog({ isOpen, onClose, onSuccess }: PlaidLinkDialogProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [step, setStep] = useState<"info" | "plaid">("info");
  const [linkToken, setLinkToken] = useState<string | null>(null);

  console.log("PlaidLinkDialog: Rendering with state", { isOpen, step, linkToken, isConnecting });
  
  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      console.log("PlaidLinkDialog: Dialog opened, resetting state");
      setStep("info");
      setLinkToken(null);
      setIsConnecting(false);
    }
  }, [isOpen]);

  // Fetch link token when dialog opens
  useEffect(() => {
    console.log("PlaidLinkDialog: useEffect triggered", { isOpen, step, linkToken });
    if (isOpen && step === "plaid" && !linkToken) {
      console.log("PlaidLinkDialog: Calling fetchLinkToken");
      fetchLinkToken();
    }
  }, [isOpen, step, linkToken]);

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

  const handleContinue = () => {
    console.log("PlaidLinkDialog: handleContinue clicked - Moving to plaid step");
    setStep("plaid");
  };

  const handleBack = () => {
    console.log("PlaidLinkDialog: Moving back to info step");
    setStep("info");
    setLinkToken(null);
  };

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
      {step === "info" && (
        <DialogContent className="sm:max-w-[500px] bg-card text-foreground border-border p-0 overflow-hidden">
          <div className="relative p-8">
            <DialogClose className="absolute right-6 top-6 rounded-full bg-muted p-2 text-muted-foreground opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-muted/80">
              <X className="h-4 w-4" />
            </DialogClose>
            
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-foreground">Connect Your Accounts</h2>
                <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  You'll be securely redirected to select your financial institution using Plaid's trusted platform.
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="text-primary">ℹ</span>
                  If your institution isn't supported by Plaid, please contact our support team for assistance.
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-8 gap-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="flex-1 gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </Button>
              <Button 
                onClick={handleContinue}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      )}

      {step === "plaid" && (
        <DialogContent className="sm:max-w-[500px] bg-card text-foreground border-border p-0 overflow-hidden">
          <div className="relative p-8">
            <DialogClose className="absolute right-6 top-6 rounded-full bg-muted p-2 text-muted-foreground opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-muted/80">
              <X className="h-4 w-4" />
            </DialogClose>
            
            <div className="text-center space-y-6">
              <img 
                src="/lovable-uploads/7372735a-98e1-411a-85a3-f01eff66a6be.png" 
                alt="Plaid connection illustration" 
                className="w-32 h-auto mx-auto"
              />
              
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
      )}
    </Dialog>
  );
}
