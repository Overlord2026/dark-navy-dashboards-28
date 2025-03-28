
import React from "react";
import { Button } from "@/components/ui/button";

interface BeneficiaryFormHeaderProps {
  isEditing: boolean;
  onCancelEdit: () => void;
}

export const BeneficiaryFormHeader = ({ 
  isEditing, 
  onCancelEdit 
}: BeneficiaryFormHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-base font-medium">
        {isEditing ? "Edit Beneficiary" : "Add Beneficiary"}
      </h3>
      {isEditing && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onCancelEdit}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};
