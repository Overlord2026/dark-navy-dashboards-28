
import React from "react";
import { Button } from "@/components/ui/button";

interface SavingsStepProps {
  onNextStep: () => void;
  onPrevStep: () => void;
}

export const SavingsStep = ({ onNextStep, onPrevStep }: SavingsStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Savings</h2>
      <p className="text-muted-foreground">
        Track how much you plan to save each year.
      </p>
      {/* Savings input fields will go here */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>Previous</Button>
        <Button onClick={onNextStep}>Next</Button>
      </div>
    </div>
  );
};
