
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { OnboardingSidePanel } from "@/components/onboarding/OnboardingSidePanel";

export const OnboardingExample = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsPanelOpen(true)}>Open Onboarding Panel</Button>
      <OnboardingSidePanel isOpen={isPanelOpen} onOpenChange={setIsPanelOpen} />
    </div>
  );
};
