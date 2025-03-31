
import React from "react";
import { Button } from "@/components/ui/button";

interface IncomeStepProps {
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const IncomeStep = ({ onNextStep, onPrevStep }: IncomeStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Income</h2>
      <p className="text-muted-foreground">
        Capture all the income you earn and expect to earn.
      </p>
      {/* Income input fields will go here */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>Previous</Button>
        <Button onClick={onNextStep}>Next</Button>
      </div>
    </div>
  );
};
