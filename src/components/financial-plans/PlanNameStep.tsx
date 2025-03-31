
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PlanNameStepProps {
  planName: string;
  onPlanNameChange: (name: string) => void;
  onNextStep: () => void;
}

export const PlanNameStep = ({ planName, onPlanNameChange, onNextStep }: PlanNameStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Plan Name</h2>
      <p className="text-muted-foreground">
        Give your financial plan a name to easily identify it.
      </p>
      <Input
        type="text"
        placeholder="My Financial Plan"
        value={planName}
        onChange={(e) => onPlanNameChange(e.target.value)}
      />
      <div className="flex justify-end gap-2">
        <Button onClick={onNextStep}>Next</Button>
      </div>
    </div>
  );
};
