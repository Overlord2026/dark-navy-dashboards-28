
import { useState, useEffect, useCallback } from "react";
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
import { Button } from "@/components/ui/button";

const CustomerProfile = () => {
  const { userProfile } = useUser();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAdvisorDrawerOpen, setIsAdvisorDrawerOpen] = useState(false);
  const [activeAdvisorTab, setActiveAdvisorTab] = useState<string | null>(null);
  const [profileKey, setProfileKey] = useState(Date.now());

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
    location: "Sarasota, FL",
    email: "daniel.herrera@awmfl.com",
    phone: "(800) 555-1234",
    office: "Sarasota, FL",
    bio: "Daniel, a seasoned finance professional, guides high net worth investors through complex financial landscapes. His comprehensive approach integrates investment management, risk mitigation, tax optimization, and overall financial strategy.\n\nBeginning his career at Vanguard, Daniel honed his skills at UBS before directing client acquisition at Fisher Investments. He now brings his expertise to our firm, where he helps clients achieve their long-term financial objectives.\n\nOriginally from Asheville, NC, Daniel now resides in Sarasota, where he enjoys fitness activities, community involvement, and enjoying the coastal lifestyle."
  };

  // Force refresh of profile data when userProfile changes
  useEffect(() => {
    console.log("CustomerProfile: UserProfile changed, refreshing view", userProfile);
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
    // Force refresh when form is closed
    setProfileKey(Date.now());
  };

  const handleCompleteForm = useCallback((formId: string) => {
    console.log(`Form completed: ${formId}`);
    
    setChecklistItems(prevItems =>
      prevItems.map(item =>
        item.id === formId ? { ...item, completed: true } : item
      )
    );
    
    // Force a refresh of the profile display
    setProfileKey(Date.now());
    
    // Close the form
    setActiveForm(null);
    setIsSheetOpen(false);
  }, []);

  const handleViewAdvisorProfile = (tabId: string) => {
    setActiveAdvisorTab(tabId);
  };

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
        toast.info("Theme change functionality coming soon");
        console.log("Change theme clicked");
        break;
      case "log-out":
        toast.info("Logout functionality coming soon");
        console.log("Log out clicked");
        break;
    }
  };

  return (
    <ThreeColumnLayout activeMainItem="home" title="Home">
      <div className="mx-auto w-full max-w-6xl space-y-4 animate-fade-in p-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h1 className="text-[24px] font-semibold mb-1 text-[#E2E2E2]">Client Profile</h1>
            <div className="flex items-center text-muted-foreground">
              <span>{`${userProfile.firstName} ${userProfile.lastName}`}</span>
            </div>
          </div>
          
          <div key={profileKey} className="mt-3 md:mt-0 bg-card rounded-lg p-4 border border-border/50 shadow-md">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{`${userProfile.firstName} ${userProfile.lastName}`}</h3>
                <p className="text-sm text-muted-foreground">{userProfile.investorType}</p>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-border/50">
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
              <Button 
                onClick={() => handleOpenForm("investor-profile")}
                className="mt-2 text-sm text-primary hover:underline"
                variant="link"
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {activeAdvisorTab ? (
          <AdvisorProfileView 
            advisorInfo={advisorInfo}
            activeTab={activeAdvisorTab}
            onTabChange={setActiveAdvisorTab}
            onBookSession={() => window.open("https://meetings.hubspot.com/daniel-herrera1?uuid=55ab1315-5daa-4009-af29-f100ee7aae67", "_blank")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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

      <UserProfileDropdown onOpenForm={handleProfileMenuItemClick} />
      
      <ProfileFormSheet 
        key={`profile-form-${activeForm}`}
        isOpen={isSheetOpen}
        onOpenChange={(open) => {
          setIsSheetOpen(open);
          if (!open) {
            // Force refresh when sheet is closed
            setTimeout(() => setProfileKey(Date.now()), 300);
          }
        }}
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
