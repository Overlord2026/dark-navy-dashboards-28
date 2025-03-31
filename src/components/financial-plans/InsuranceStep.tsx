
import React from "react";
import { Button } from "@/components/ui/button";

interface InsuranceStepProps {
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const InsuranceStep = ({ onPrevStep, onNextStep }: InsuranceStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Insurance</h2>
      <p className="text-muted-foreground">
        Add details about your current insurance coverage.
      </p>
      {/* Insurance input fields will go here */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevStep}>Previous</Button>
        <Button onClick={onNextStep}>Next</Button>
      </div>
    </div>
  );
};
