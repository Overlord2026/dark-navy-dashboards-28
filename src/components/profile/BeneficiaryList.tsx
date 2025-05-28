
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Eye } from "lucide-react";
import { z } from "zod";
import { beneficiarySchema } from "./beneficiarySchema";
import { BeneficiaryViewDialog } from "./BeneficiaryViewDialog";

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
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = React.useState<z.infer<typeof beneficiarySchema> | null>(null);
  
  console.log('BeneficiaryList rendering with beneficiaries:', beneficiaries?.length || 0);
  
  if (beneficiaries.length === 0) {
    console.log('No beneficiaries to display');
    return null;
  }

  const handleView = (beneficiary: z.infer<typeof beneficiarySchema>) => {
    console.log('View button clicked for beneficiary:', beneficiary.firstName, beneficiary.lastName);
    setSelectedBeneficiary(beneficiary);
    setViewDialogOpen(true);
  };
  
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Current Beneficiaries</h3>
        </div>
        
        <div className="space-y-2">
          {beneficiaries.map((beneficiary, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between border rounded-md p-3 bg-card"
            >
              <div>
                <p className="font-medium text-foreground">{beneficiary.firstName} {beneficiary.lastName}</p>
                <p className="text-sm text-muted-foreground">{beneficiary.relationship}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleView(beneficiary)}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
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
                  className="flex items-center"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BeneficiaryViewDialog
        isOpen={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        beneficiary={selectedBeneficiary}
      />
    </>
  );
};
