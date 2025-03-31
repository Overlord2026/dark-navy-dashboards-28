
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  isSelected?: boolean;
}

interface AssetsStepProps {
  accounts: Account[];
  onAccountSelect: (accountId: string, isChecked: boolean) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const AssetsStep = ({ accounts, onAccountSelect, onNextStep, onPrevStep }: AssetsStepProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Assets</h2>
      <p className="text-muted-foreground mb-4">
        Choose which accounts to add to your plan.
      </p>
      
      <div className="space-y-4">
        {accounts.map((account) => (
          <div key={account.id} className="flex items-center justify-between p-4 bg-[#1A1A2E] rounded-lg border border-border/20">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id={`account-${account.id}`} 
                checked={account.isSelected} 
                onCheckedChange={(checked) => onAccountSelect(account.id, !!checked)}
              />
              <div>
                <Label 
                  htmlFor={`account-${account.id}`} 
                  className="text-base font-medium cursor-pointer"
                >
                  {account.name}
                </Label>
                <p className="text-sm text-muted-foreground">{account.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${account.balance.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>Previous</Button>
        <Button onClick={onNextStep}>Next</Button>
      </div>
    </div>
  );
};
