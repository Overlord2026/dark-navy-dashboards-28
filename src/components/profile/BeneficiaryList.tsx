
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { z } from "zod";
import { beneficiarySchema } from "./beneficiarySchema";

interface BeneficiaryListProps {
  beneficiaries: z.infer<typeof beneficiarySchema>[];
  onEdit: (beneficiary: z.infer<typeof beneficiarySchema>) => void;
  onRemove: (beneficiary: z.infer<typeof beneficiarySchema>) => void;
}

export const BeneficiaryList = ({ 
  beneficiaries, 
  onEdit, 
  onRemove 
}: BeneficiaryListProps) => {
  if (beneficiaries.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Current Beneficiaries</h3>
      </div>
      
      <div className="space-y-2">
        {beneficiaries.map((beneficiary, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between border rounded-md p-3"
          >
            <div>
              <p className="font-medium">{beneficiary.firstName} {beneficiary.lastName}</p>
              <p className="text-sm text-muted-foreground">{beneficiary.relationship}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(beneficiary)}
              >
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onRemove(beneficiary)}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
