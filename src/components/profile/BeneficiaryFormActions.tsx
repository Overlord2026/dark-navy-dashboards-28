
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
      {/* All buttons removed as requested */}
    </div>
  );
};
