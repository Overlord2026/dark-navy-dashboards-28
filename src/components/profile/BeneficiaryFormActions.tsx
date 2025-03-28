
import React from "react";
import { Button } from "@/components/ui/button";

interface BeneficiaryFormActionsProps {
  isEditing: boolean;
  hasBeneficiaries: boolean;
  onSave: () => void;
}

export const BeneficiaryFormActions = ({ 
  isEditing, 
  hasBeneficiaries, 
  onSave 
}: BeneficiaryFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      {hasBeneficiaries === false ? (
        <Button 
          variant="outline" 
          type="button"
          onClick={onSave}
        >
          No Beneficiaries to Add
        </Button>
      ) : null}
      <Button type="submit">
        {isEditing ? "Update Beneficiary" : "Add Beneficiary"}
      </Button>
      {hasBeneficiaries && !isEditing ? (
        <Button 
          type="button"
          onClick={onSave}
        >
          Save
        </Button>
      ) : null}
    </div>
  );
};
