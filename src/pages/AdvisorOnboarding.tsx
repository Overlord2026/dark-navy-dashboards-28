
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { AdvisorWelcomeModal } from "@/components/advisor/AdvisorWelcomeModal";
import { AdvisorSetupFlow } from "@/components/advisor/AdvisorSetupFlow";

export default function AdvisorOnboarding() {
  const navigate = useNavigate();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [setupStarted, setSetupStarted] = useState(false);

  const handleStartSetup = () => {
    setShowWelcomeModal(false);
    setSetupStarted(true);
  };

  const handleSkipForNow = () => {
    setShowWelcomeModal(false);
    navigate("/advisor-dashboard");
  };

  return (
    <ThreeColumnLayout activeMainItem="advisor" title="Advisor Onboarding">
      <div className="w-full max-w-6xl mx-auto p-4">
        {showWelcomeModal && (
          <AdvisorWelcomeModal 
            onStartSetup={handleStartSetup} 
            onSkipForNow={handleSkipForNow} 
          />
        )}
        
        {setupStarted && <AdvisorSetupFlow />}
        
        {!showWelcomeModal && !setupStarted && (
          <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
            <h2 className="text-2xl font-semibold">Advisor Onboarding</h2>
            <p className="text-muted-foreground text-center max-w-md">
              You've skipped the initial setup. You can configure your practice details 
              and portal branding anytime from the Advisor Settings page.
            </p>
          </div>
        )}
      </div>
    </ThreeColumnLayout>
  );
}
