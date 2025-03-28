
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { SetupChecklist } from "@/components/profile/SetupChecklist";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
import { AdvisorSection } from "@/components/profile/AdvisorSection";
import { AccountSummaryCard } from "@/components/profile/AccountSummaryCard";
import { AdvisorProfileView } from "@/components/profile/AdvisorProfileView";
import { BookSessionDrawer } from "@/components/profile/BookSessionDrawer";
import { ProfileFormSheet } from "@/components/profile/ProfileFormSheet";

const CustomerProfile = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAdvisorDrawerOpen, setIsAdvisorDrawerOpen] = useState(false);
  const [activeAdvisorTab, setActiveAdvisorTab] = useState<string | null>(null);

  // Checklist items with their completion status
  const [checklistItems, setChecklistItems] = useState([
    { id: "investor-profile", name: "Investor Profile", completed: true },
    { id: "contact-information", name: "Contact Information", completed: true },
    { id: "additional-information", name: "Additional Information", completed: false },
    { id: "beneficiaries", name: "Beneficiaries", completed: true },
    { id: "affiliations", name: "Affiliations", completed: true },
    { id: "investment-advisory-agreement", name: "Investment Advisory Agreement", completed: true },
    { id: "disclosures", name: "Disclosures", completed: false },
    { id: "custodian-agreement", name: "Custodian Agreement", completed: false }
  ]);

  const advisorInfo = {
    name: "Daniel Herrera",
    title: "Certified Financial Planner™",
    location: "Tampa, FL",
    email: "daniel.herrera@farther.com",
    phone: "(800) 555-1234",
    office: "New York, NY",
    bio: "Daniel, a seasoned finance professional, guides high net worth investors. His approach blends investment management, risk mitigation, tax optimization, and overall strategy. Starting at Vanguard, then UBS, he directed client acquisition at Fisher Investments before joining Farther. Originally from Asheville, NC, Daniel now resides in Tampa, enjoying fitness, community activities, and sunny days by the water."
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

  const handleViewAdvisorProfile = (tabId: string) => {
    setActiveAdvisorTab(tabId);
  };

  return (
    <ThreeColumnLayout activeMainItem="home" title="Client Profile">
      <div className="mx-auto w-full max-w-6xl space-y-6 animate-fade-in p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Client Profile</h1>
            <div className="flex items-center text-muted-foreground">
              <span>Antonio Gomez</span>
            </div>
          </div>
        </div>

        {activeAdvisorTab ? (
          <AdvisorProfileView 
            advisorInfo={advisorInfo}
            activeTab={activeAdvisorTab}
            onTabChange={setActiveAdvisorTab}
            onBookSession={() => setIsAdvisorDrawerOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AccountSummaryCard />
            </div>

            <div className="lg:col-span-1">
              <SetupChecklist 
                items={checklistItems} 
                onItemClick={(itemId) => handleOpenForm(itemId)} 
              />
            </div>
          </div>
        )}
      </div>

      {/* Fixed Position Components */}
      <UserProfileDropdown onOpenForm={handleOpenForm} />
      
      <AdvisorSection 
        advisorInfo={advisorInfo}
        onViewProfile={handleViewAdvisorProfile}
        onBookSession={() => setIsAdvisorDrawerOpen(true)}
      />

      <ProfileFormSheet 
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        activeForm={activeForm}
        onFormSave={handleCompleteForm}
      />

      <BookSessionDrawer 
        isOpen={isAdvisorDrawerOpen}
        onOpenChange={setIsAdvisorDrawerOpen}
        advisorInfo={advisorInfo}
      />
    </ThreeColumnLayout>
  );
};

export default CustomerProfile;
