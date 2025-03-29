import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { SetupChecklist } from "@/components/profile/SetupChecklist";
import { ProfileFormSheet } from "@/components/profile/ProfileFormSheet";
import { UpcomingBillsCard } from "@/components/dashboard/UpcomingBillsCard";
import { ExpenseOptimizationCard } from "@/components/dashboard/ExpenseOptimizationCard";
import { WelcomeTrialBanner } from "@/components/dashboard/WelcomeTrialBanner";
import { MidTrialBanner } from "@/components/dashboard/MidTrialBanner";
import { TrialEndingSoonBanner } from "@/components/dashboard/TrialEndingSoonBanner";
import { ExpirationNotice } from "@/components/subscription/ExpirationNotice";
import { TrialExtensionBanner } from "@/components/subscription/TrialExtensionBanner";
import { useSubscription } from "@/context/SubscriptionContext"; 
import { toast } from "sonner";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showBusinessMetrics, setShowBusinessMetrics] = useState(false);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);
  const [showMidTrialBanner, setShowMidTrialBanner] = useState(false);
  const [showTrialEndingSoonBanner, setShowTrialEndingSoonBanner] = useState(false);
  const [showExpirationNotice, setShowExpirationNotice] = useState(false);
  const [showExtensionBanner, setShowExtensionBanner] = useState(false);
  const { 
    isInFreeTrial, 
    daysRemainingInTrial, 
    freeTrialEndDate, 
    trialWasExtended,
    extendTrial
  } = useSubscription();
  
  const [checklistItems, setChecklistItems] = useState([
    { id: "investor-profile", name: "Investor Profile", completed: true },
    { id: "contact-information", name: "Contact Information", completed: true },
    { id: "additional-information", name: "Additional Information", completed: false, description: "Please fill out" },
    { id: "beneficiaries", name: "Beneficiaries", completed: true },
    { id: "affiliations", name: "Affiliations", completed: true },
    { id: "investment-advisory-agreement", name: "Investment Advisory Agreement", completed: true },
    { id: "disclosures", name: "Disclosures", completed: false, description: "Please look over and accept disclosures" },
    { id: "custodian-agreement", name: "Custodian Agreement", completed: false, description: "Waiting for your Advisor's Plan" }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isInFreeTrial) {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcomeBanner');
      if (!hasSeenWelcome) {
        setShowWelcomeBanner(true);
      }
      
      const hasSeenMidTrial = localStorage.getItem('hasSeenMidTrialBanner');
      if (daysRemainingInTrial !== null && 
          daysRemainingInTrial <= 45 && 
          daysRemainingInTrial >= 40 && 
          !hasSeenMidTrial) {
        setShowMidTrialBanner(true);
      }

      const hasSeenTrialEndingSoon = localStorage.getItem('hasSeenTrialEndingSoonBanner');
      if (daysRemainingInTrial !== null && 
          daysRemainingInTrial <= 14 && 
          daysRemainingInTrial >= 10 && 
          !hasSeenTrialEndingSoon) {
        setShowTrialEndingSoonBanner(true);
      }
      
      const hasSeenExpirationNotice = localStorage.getItem('hasSeenExpirationNotice');
      if (daysRemainingInTrial !== null && 
          daysRemainingInTrial <= 5 && 
          !hasSeenExpirationNotice) {
        setShowExpirationNotice(true);
      }
      
      const hasSeenExtensionBanner = localStorage.getItem('hasSeenExtensionBanner');
      const hasCompletedSetup = checklistItems.filter(item => item.completed).length >= 6;
      
      if (hasCompletedSetup && !hasSeenExtensionBanner && !trialWasExtended) {
        extendTrial(14);
        setShowExtensionBanner(true);
      }
    }
  }, [isInFreeTrial, daysRemainingInTrial, trialWasExtended, checklistItems]);

  const handleDismissWelcome = () => {
    setShowWelcomeBanner(false);
    localStorage.setItem('hasSeenWelcomeBanner', 'true');
  };
  
  const handleDismissMidTrial = () => {
    setShowMidTrialBanner(false);
    localStorage.setItem('hasSeenMidTrialBanner', 'true');
  };

  const handleDismissTrialEndingSoon = () => {
    setShowTrialEndingSoonBanner(false);
    localStorage.setItem('hasSeenTrialEndingSoonBanner', 'true');
  };
  
  const handleDismissExpirationNotice = () => {
    setShowExpirationNotice(false);
    localStorage.setItem('hasSeenExpirationNotice', 'true');
  };

  const handleDismissExtensionBanner = () => {
    setShowExtensionBanner(false);
    localStorage.setItem('hasSeenExtensionBanner', 'true');
  };

  const toggleMetrics = () => {
    setShowBusinessMetrics(!showBusinessMetrics);
  };

  const handleOpenForm = (formId: string) => {
    console.log(`Opening form: ${formId}`);
    setActiveForm(formId);
    setIsSheetOpen(true);
  };

  const handleCloseForm = () => {
    setActiveForm(null);
    setIsSheetOpen(false);
  };

  const handleCompleteForm = (formId: string) => {
    console.log(`Completing form: ${formId}`);
    
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === formId ? { ...item, completed: true } : item
      )
    );
    
    const itemName = checklistItems.find(item => item.id === formId)?.name || "";
    toast.success(`${itemName} updated successfully`);
    
    handleCloseForm();
  };

  return (
    <ThreeColumnLayout activeMainItem="home" title="Home">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse-slow flex flex-col items-center">
            <div className="h-10 w-48 bg-card rounded-md mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full max-w-6xl">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-card rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-6 animate-fade-in">
          {showWelcomeBanner && (
            <WelcomeTrialBanner onDismiss={handleDismissWelcome} />
          )}
          
          {showExtensionBanner && (
            <TrialExtensionBanner onDismiss={handleDismissExtensionBanner} />
          )}

          {showMidTrialBanner && (
            <MidTrialBanner onDismiss={handleDismissMidTrial} />
          )}

          {showTrialEndingSoonBanner && (
            <TrialEndingSoonBanner onDismiss={handleDismissTrialEndingSoon} />
          )}
          
          {showExpirationNotice && (
            <ExpirationNotice onDismiss={handleDismissExpirationNotice} />
          )}
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 space-y-6">
              <NetWorthSummary />
              <FinancialOverview showBusinessMetrics={showBusinessMetrics} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RecentActivity />
                
                <div className="space-y-4">
                  <UpcomingBillsCard />
                  <ExpenseOptimizationCard />
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-[#1EAEDB]/10 p-1 rounded-lg border-2 border-[#FFD700]">
                <SetupChecklist 
                  items={checklistItems} 
                  onItemClick={handleOpenForm} 
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ProfileFormSheet 
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        activeForm={activeForm}
        onFormSave={handleCompleteForm}
      />
    </ThreeColumnLayout>
  );
};

export default Dashboard;
