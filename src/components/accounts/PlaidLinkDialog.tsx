
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PlaidLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (linkToken: string) => void;
}

export function PlaidLinkDialog({ isOpen, onClose, onSuccess }: PlaidLinkDialogProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate Plaid connection
    setTimeout(() => {
      setIsConnecting(false);
      
      // In a real implementation, this would be the response from the Plaid API
      const mockLinkToken = "plaid-mock-link-token-" + Date.now();
      
      toast({
        title: "Success",
        description: "Your accounts have been successfully linked"
      });
      
      onSuccess(mockLinkToken);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#121a2c] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>Link Your Accounts</DialogTitle>
          <DialogDescription className="text-gray-400">
            Connect your financial accounts securely through Plaid.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p className="mb-4 text-sm text-gray-300">
            You'll be redirected to Plaid's secure interface to select your financial 
            institution and authenticate your accounts.
          </p>
          
          <div className="bg-[#1c2e4a] border border-gray-700 rounded-md p-4 mb-4">
            <h4 className="font-medium mb-2">What is Plaid?</h4>
            <p className="text-sm text-gray-300">
              Plaid is a secure financial service that allows you to connect your bank
              accounts to apps you want to use. We use Plaid to securely access your 
              financial data with your permission.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-700 text-white hover:bg-[#1c2e4a]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect Accounts"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
