
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  CreditCard, 
  TrendingUp, 
  Banknote, 
  Coins, 
  AlertTriangle, 
  Package,
  Briefcase
} from "lucide-react";

interface AddAccountTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountTypeSelect: (type: string) => void;
}

export function AddAccountTypeDialog({ 
  open, 
  onOpenChange, 
  onAccountTypeSelect 
}: AddAccountTypeDialogProps) {
  const accountTypes = [
    {
      id: "bank",
      name: "Bank Account",
      description: "Checking, savings, or other bank accounts",
      icon: <Banknote className="h-6 w-6" />
    },
    {
      id: "investment",
      name: "Investment Account",
      description: "Brokerage, retirement, or investment accounts",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      id: "credit-card",
      name: "Credit Card",
      description: "Credit cards and lines of credit",
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      id: "private-equity",
      name: "Private Equity",
      description: "Private equity investments and holdings",
      icon: <Briefcase className="h-6 w-6" />
    },
    {
      id: "digital-assets",
      name: "Digital Assets",
      description: "Cryptocurrency and digital currencies",
      icon: <Coins className="h-6 w-6" />
    },
    {
      id: "other-assets",
      name: "Other Assets",
      description: "Vehicles, collectibles, and other valuables",
      icon: <Package className="h-6 w-6" />
    },
    {
      id: "liability",
      name: "Liability",
      description: "Loans, mortgages, and other debts",
      icon: <AlertTriangle className="h-6 w-6" />
    },
    {
      id: "property",
      name: "Real Estate",
      description: "Properties and real estate investments",
      icon: <Building className="h-6 w-6" />
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>What type of account would you like to add?</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 py-4">
          {accountTypes.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start text-left space-y-2 hover:bg-accent"
              onClick={() => onAccountTypeSelect(type.id)}
            >
              <div className="flex items-center space-x-2 w-full">
                <div className="text-primary">{type.icon}</div>
                <span className="font-medium">{type.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {type.description}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
