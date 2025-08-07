
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { AdvisorWelcomeModal } from "@/components/advisor/AdvisorWelcomeModal";
import { AdvisorOnboardingWizard } from "@/components/advisor/AdvisorOnboardingWizard";
import { LindaAIAssistant } from "@/components/advisor/LindaAIAssistant";
import { PageTransition, StaggerContainer } from "@/components/animations/PageTransition";

export default function AdvisorOnboarding() {
  const navigate = useNavigate();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [setupStarted, setSetupStarted] = useState(false);
  const [showLinda, setShowLinda] = useState(false);
  const [lindaMinimized, setLindaMinimized] = useState(false);

  const handleStartSetup = () => {
    setShowWelcomeModal(false);
    setSetupStarted(true);
    setShowLinda(true);
  };

  const handleSkipForNow = () => {
    setShowWelcomeModal(false);
    navigate("/advisor-dashboard");
  };

  const handleOnboardingComplete = () => {
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
        
        {setupStarted && (
          <PageTransition delay={0.2}>
            <AdvisorOnboardingWizard onComplete={handleOnboardingComplete} />
          </PageTransition>
        )}
        
        {!showWelcomeModal && !setupStarted && (
          <StaggerContainer>
            <motion.div 
              className="flex flex-col items-center justify-center h-[60vh] space-y-6"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <motion.h2 
                className="text-2xl font-semibold"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                Advisor Onboarding
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-center max-w-md"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                You've skipped the initial setup. You can configure your practice details 
                and portal branding anytime from the Advisor Settings page.
              </motion.p>
            </motion.div>
          </StaggerContainer>
        )}
      </div>

      {/* Linda AI Assistant */}
      {showLinda && (
        <LindaAIAssistant
          isMinimized={lindaMinimized}
          onToggleMinimize={() => setLindaMinimized(!lindaMinimized)}
          onClose={() => setShowLinda(false)}
        />
      )}
    </ThreeColumnLayout>
  );
}
