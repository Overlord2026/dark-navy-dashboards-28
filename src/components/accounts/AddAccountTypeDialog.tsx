
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  TrendingUp, 
  PiggyBank, 
  Home, 
  LineChart, 
  Users, 
  Coins,
  Package,
  CreditCard
} from "lucide-react";

interface AddAccountTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountTypeSelect: (accountType: string) => void;
}

const accountTypes = [
  { id: 'bank', label: 'Bank Account', icon: Building2 },
  { id: 'investment', label: 'Investment Account', icon: TrendingUp },
  { id: 'retirement', label: 'Retirement Plans', icon: PiggyBank },
  { id: 'real-estate', label: 'Real Estate', icon: Home },
  { id: 'public-stock', label: 'Public Stock', icon: LineChart },
  { id: 'private-equity', label: 'Private Equity', icon: Users },
  { id: 'digital-assets', label: 'Digital Assets', icon: Coins },
  { id: 'other-assets', label: 'Other Assets', icon: Package },
  { id: 'liability', label: 'Liability', icon: CreditCard },
];

export function AddAccountTypeDialog({ 
  open, 
  onOpenChange, 
  onAccountTypeSelect 
}: AddAccountTypeDialogProps) {
  const handleAccountTypeClick = (accountType: string) => {
    onAccountTypeSelect(accountType);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Account Type</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {accountTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                variant="outline"
                className="w-full justify-start h-12 text-left"
                onClick={() => handleAccountTypeClick(type.id)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {type.label}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
