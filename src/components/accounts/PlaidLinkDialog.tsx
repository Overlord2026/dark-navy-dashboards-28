
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
    console.log("PlaidLinkDialog: Moving to plaid step");
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
        <DialogContent className="sm:max-w-[600px] bg-[#121a2c] text-white border-gray-800 p-0 overflow-hidden">
          <div className="p-6">
            <DialogClose className="absolute right-4 top-4 rounded-full bg-gray-800 p-1.5 text-gray-400 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
              <X className="h-4 w-4" />
            </DialogClose>
            
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-2">To link accounts, you'll be asked to select your institution using Plaid.</h2>
              <p className="text-gray-400 text-sm">
                * We use Plaid to authenticate your accounts. In the case your institution isn't supported by Plaid, contact us for further assistance.
              </p>
            </div>

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={onClose}
                className="border-gray-700 text-white hover:bg-[#1c2e4a] gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={handleContinue}
                className="bg-white text-black hover:bg-gray-200"
              >
                Link Accounts
              </Button>
            </div>
          </div>
        </DialogContent>
      )}

      {step === "plaid" && (
        <DialogContent className="sm:max-w-[600px] bg-white text-black border-gray-200 p-0 overflow-hidden">
          <DialogClose className="absolute right-4 top-4 rounded-full bg-gray-100 p-1 text-gray-600 opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
          </DialogClose>
          
          <div className="p-8 flex flex-col items-center">
            <img 
              src="/lovable-uploads/7372735a-98e1-411a-85a3-f01eff66a6be.png" 
              alt="Plaid connection illustration" 
              className="w-40 h-auto mb-4"
            />
            
            <h2 className="text-xl font-semibold text-center mb-1">
              <span className="font-bold">Advanced Wealth Management</span> uses <span className="font-bold">Plaid</span> to connect your account
            </h2>
            
            <div className="my-8 w-full max-w-md space-y-6">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-gray-700 mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Connect in seconds</h3>
                  <p className="text-gray-600 text-sm">
                    8000+ apps trust Plaid to quickly connect to financial institutions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-gray-700 mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm">Keep your data safe</h3>
                  <p className="text-gray-600 text-sm">
                    Plaid uses best-in-class encryption to help protect your data
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 text-center mb-6 max-w-md">
              By continuing, you agree to Plaid's <a href="#" className="underline">Privacy Policy</a> and to receiving updates on plaid.com
            </div>
            
            <Button 
              onClick={handleConnect}
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "Continue"}
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
