
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { WelcomeTrialBanner } from "@/components/dashboard/WelcomeTrialBanner";
import { usePagePerformance } from "@/hooks/usePagePerformance";
import { ValueDrivenSavingsCalculator } from "@/components/ValueDrivenSavingsCalculator";
import { AdvisorCalculatorModal } from "@/components/AdvisorCalculatorModal";
import { Button } from "@/components/ui/button";
import { Settings, User } from "lucide-react";

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { isInFreeTrial } = useSubscription();
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [advisorMode, setAdvisorMode] = useState(false);
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  
  usePagePerformance('/client-dashboard');
  
  console.log('Dashboard: AdminActions component completely removed');

  const handleDismissBanner = () => {
    setShowWelcomeBanner(false);
  };

  const handleAdvisorCalculate = (results: any) => {
    setShowAdvisorModal(true);
  };

  useEffect(() => {
    console.log('Dashboard component rendered:', new Date().toISOString());
    console.log('Dashboard: NO AdminActions component rendered');
    
    return () => {
      console.log('Dashboard component unmounted:', new Date().toISOString());
    };
  }, []);

  return (
    <ThreeColumnLayout>
      <div className="space-y-4 px-4 py-2 max-w-7xl mx-auto">
        {isInFreeTrial && showWelcomeBanner && (
          <WelcomeTrialBanner onDismiss={handleDismissBanner} />
        )}
        
        <div className="space-y-4">
          {/* Advisor Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Calculator Mode</p>
                <p className="text-sm text-muted-foreground">
                  {advisorMode ? 'Advisor mode enabled for client consultations' : 'Client view - read-only fee summary'}
                </p>
              </div>
            </div>
            <Button
              variant={advisorMode ? "default" : "outline"}
              size="sm"
              onClick={() => setAdvisorMode(!advisorMode)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {advisorMode ? 'Exit Advisor Mode' : 'Enable Advisor Mode'}
            </Button>
          </div>

          <ValueDrivenSavingsCalculator 
            isHeroWidget={true} 
            className="mb-8"
            advisorMode={advisorMode}
            onAdvisorCalculate={handleAdvisorCalculate}
          />
        </div>
        
        <div>
          <NetWorthSummary />
        </div>
      </div>

      {/* Advisor Calculator Modal */}
      <AdvisorCalculatorModal
        open={showAdvisorModal}
        onClose={() => setShowAdvisorModal(false)}
      />
    </ThreeColumnLayout>
  );
}
