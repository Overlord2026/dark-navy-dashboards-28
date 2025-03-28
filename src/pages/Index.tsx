
import React, { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { NetWorthSummary } from "@/components/dashboard/NetWorthSummary";
import { SetupChecklist } from "@/components/profile/SetupChecklist";
import { ProfileFormSheet } from "@/components/profile/ProfileFormSheet";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [showBusinessMetrics, setShowBusinessMetrics] = useState(false);
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
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

  const toggleMetrics = () => {
    setShowBusinessMetrics(!showBusinessMetrics);
  };

  const handleOpenForm = (formId: string) => {
    setActiveForm(formId);
    setIsSheetOpen(true);
  };

  const handleCloseForm = () => {
    setActiveForm(null);
    setIsSheetOpen(false);
  };

  const handleCompleteForm = (formId: string) => {
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === formId ? { ...item, completed: true } : item
      )
    );
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
        <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 space-y-6">
              <NetWorthSummary />
              <FinancialOverview showBusinessMetrics={showBusinessMetrics} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RecentActivity />
                
                <DashboardCard
                  title="Upcoming Tax Deadlines"
                  className=""
                >
                  <div className="space-y-4">
                    <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">Quarterly Tax Filing</h4>
                          <p className="text-sm">Federal income tax deadline</p>
                        </div>
                        <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs font-medium">
                          15 days left
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">State Sales Tax</h4>
                          <p className="text-sm">Monthly sales tax report</p>
                        </div>
                        <div className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs font-medium">
                          22 days left
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-medium">Payroll Tax Deposit</h4>
                          <p className="text-sm">Monthly employer federal tax</p>
                        </div>
                        <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                          30 days left
                        </div>
                      </div>
                    </div>
                  </div>
                </DashboardCard>
              </div>
            </div>
            
            <div className="lg:w-1/3">
              <SetupChecklist 
                items={checklistItems} 
                onItemClick={handleOpenForm} 
              />
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
