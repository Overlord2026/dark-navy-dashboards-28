
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { WelcomeTrialBanner } from "@/components/dashboard/WelcomeTrialBanner";
import { usePagePerformance } from "@/hooks/usePagePerformance";
import { PageTransition, StaggerContainer } from "@/components/animations/PageTransition";
import { DashboardErrorBoundary } from "@/components/dashboard/DashboardErrorBoundary";
import { motion } from "framer-motion";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { isInFreeTrial } = useSubscription();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  
  usePagePerformance('/client-dashboard');

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
  };

  return (
    <ThreeColumnLayout>
      <PageTransition>
        <StaggerContainer className="space-y-6 px-4 py-2 max-w-7xl mx-auto">
          {isInFreeTrial && showWelcomeBanner && (
            <DashboardErrorBoundary componentName="Welcome Banner">
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <WelcomeTrialBanner onDismiss={handleDismissBanner} />
              </motion.div>
            </DashboardErrorBoundary>
          )}
          
          {/* Dashboard Content */}
          <DashboardContent />
        </StaggerContainer>
      </PageTransition>
    </ThreeColumnLayout>
  );
}
