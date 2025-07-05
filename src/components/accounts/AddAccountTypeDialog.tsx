
import React from "react";
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
  Briefcase,
  PiggyBank
} from "lucide-react";
import { cn } from "@/lib/utils";

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
      id: "retirement-plan",
      name: "Retirement Plan",
      description: "401K, 457, 403B, and other retirement plans",
      icon: <PiggyBank className="h-6 w-6" />
    },
    {
      id: "investment",
      name: "Investment Account",
      description: "Brokerage, retirement, or investment accounts",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      id: "public-stock",
      name: "Public Stock",
      description: "Individual stocks and equity investments",
      icon: <TrendingUp className="h-6 w-6" />
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
      <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden bg-card border border-border/50 shadow-2xl">
        <div className="relative">
          {/* Header with gradient background */}
          <div className="relative px-8 py-5 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-b border-border/30">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-50" />
            <DialogHeader className="relative">
              <DialogTitle className="text-2xl font-semibold text-foreground tracking-tight">
                Choose Account Type
              </DialogTitle>
              <p className="text-muted-foreground mt-2 text-base">
                Select the type of account you'd like to add to your portfolio
              </p>
            </DialogHeader>
          </div>
          
          {/* Account types grid */}
          <div className="p-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {accountTypes.map((type, index) => (
                <button
                  key={type.id}
                  onClick={() => onAccountTypeSelect(type.id)}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border border-border/40 bg-card",
                    "p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
                    "hover:border-primary/30 hover:-translate-y-1 focus:outline-none focus:ring-2",
                    "focus:ring-primary/20 focus:border-primary/50 active:scale-[0.98]",
                    // Stagger animation delay based on index
                    "animate-fade-in"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Subtle gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon container */}
                  <div className="relative mb-4">
                    <div className={cn(
                      "inline-flex p-3 rounded-lg bg-primary/10 text-primary transition-all duration-300",
                      "group-hover:bg-primary/15 group-hover:scale-110"
                    )}>
                      {React.cloneElement(type.icon, { 
                        className: "h-6 w-6 transition-transform duration-300 group-hover:scale-110" 
                      })}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {type.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                  
                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
