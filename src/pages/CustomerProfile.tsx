
import { useState, useEffect } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { SetupChecklist } from "@/components/profile/SetupChecklist";
import { UserProfileDropdown } from "@/components/profile/UserProfileDropdown";
import { AdvisorSection } from "@/components/profile/AdvisorSection";
import { AccountSummaryCard } from "@/components/profile/AccountSummaryCard";
import { AdvisorProfileView } from "@/components/profile/AdvisorProfileView";
import { BookSessionDrawer } from "@/components/profile/BookSessionDrawer";
import { ProfileFormSheet } from "@/components/profile/ProfileFormSheet";
import { UserCircle } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

const CustomerProfile = () => {
  const { userProfile } = useUser();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAdvisorDrawerOpen, setIsAdvisorDrawerOpen] = useState(false);
  const [activeAdvisorTab, setActiveAdvisorTab] = useState<string | null>(null);
  const [profileKey, setProfileKey] = useState(Date.now()); // Add a key to force re-render

  const [checklistItems, setChecklistItems] = useState([
    { id: "investor-profile", name: "Investor Profile", completed: true },
    { id: "contact-information", name: "Contact Information", completed: true },
    { id: "additional-information", name: "Additional Information", completed: false, description: "Please fill out" },
    { id: "beneficiaries", name: "Beneficiaries", completed: true },
    { id: "affiliations", name: "Affiliations", completed: true },
    { id: "trusts", name: "Trusts", completed: false, description: "Please fill out" },
    { id: "security-access", name: "Security & Access", completed: false, description: "Please fill out" },
    { id: "investment-advisory-agreement", name: "Investment Advisory Agreement", completed: true },
    { id: "disclosures", name: "Disclosures", completed: false, description: "Please look over and accept disclosures" },
    { id: "custodian-agreement", name: "Custodian Agreement", completed: false, description: "Waiting for your Advisor's Plan" }
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

  // Force profile section to update when userProfile changes
  useEffect(() => {
    setProfileKey(Date.now());
  }, [userProfile]);

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
    console.log(`Form completed: ${formId}`);
    
    // Update checklist items
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === formId ? { ...item, completed: true } : item
      )
    );
    
    // Force UI update for profile information
    setProfileKey(Date.now());
    
    // Close the form
    handleCloseForm();
  };

  const handleViewAdvisorProfile = (tabId: string) => {
    setActiveAdvisorTab(tabId);
  };

  // Handle the user profile dropdown menu item clicks
  const handleProfileMenuItemClick = (itemId: string) => {
    console.log(`Profile menu item clicked: ${itemId}`);
    
    switch (itemId) {
      case "investor-profile":
      case "contact-information":
      case "additional-information":
      case "beneficiaries":
      case "affiliations":
      case "trusts":
      case "security-access":
      case "investment-advisory-agreement":
      case "disclosures":
      case "custodian-agreement":
        handleOpenForm(itemId);
        break;
      case "change-theme":
        // Theme change functionality would go here
        toast.info("Theme change functionality coming soon");
        console.log("Change theme clicked");
        break;
      case "log-out":
        // Logout functionality would go here
        toast.info("Logout functionality coming soon");
        console.log("Log out clicked");
        break;
    }
  };

  return (
    <ThreeColumnLayout activeMainItem="home" title="Home">
      <div className="mx-auto w-full max-w-6xl space-y-6 animate-fade-in p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-[24px] font-semibold mb-1 text-[#E2E2E2]">Client Profile</h1>
            <div className="flex items-center text-muted-foreground">
              <span>{`${userProfile.firstName} ${userProfile.lastName}`}</span>
            </div>
          </div>
          
          {/* Client Profile Section - Top Right */}
          <div key={profileKey} className="mt-4 md:mt-0 bg-card rounded-lg p-4 border border-border/50 shadow-md">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{`${userProfile.firstName} ${userProfile.lastName}`}</h3>
                <p className="text-sm text-muted-foreground">{userProfile.investorType}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/50">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Email:</p>
                  <p>{userProfile.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone:</p>
                  <p>{userProfile.phone}</p>
                </div>
              </div>
              <button 
                onClick={() => handleOpenForm("investor-profile")}
                className="mt-3 text-sm text-primary hover:underline"
              >
                Edit Profile
              </button>
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
      <UserProfileDropdown onOpenForm={handleProfileMenuItemClick} />
      
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
