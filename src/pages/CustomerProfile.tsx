
import { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { 
  Check, 
  ChevronRight, 
  X, 
  Plus, 
  Calendar, 
  Search,
  Info
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ContactForm } from "@/components/profile/ContactForm";
import { AdditionalInfoForm } from "@/components/profile/AdditionalInfoForm";
import { BeneficiariesForm } from "@/components/profile/BeneficiariesForm";
import { AffiliationsForm } from "@/components/profile/AffiliationsForm";
import { TrustsForm } from "@/components/profile/TrustsForm";
import { SecurityForm } from "@/components/profile/SecurityForm";
import { SetupChecklist } from "@/components/profile/SetupChecklist";

const CustomerProfile = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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

  const renderFormContent = () => {
    switch (activeForm) {
      case "investor-profile":
        return <ProfileForm onSave={() => handleCompleteForm("investor-profile")} />;
      case "contact-information":
        return <ContactForm onSave={() => handleCompleteForm("contact-information")} />;
      case "additional-information":
        return <AdditionalInfoForm onSave={() => handleCompleteForm("additional-information")} />;
      case "beneficiaries":
        return <BeneficiariesForm onSave={() => handleCompleteForm("beneficiaries")} />;
      case "affiliations":
        return <AffiliationsForm onSave={() => handleCompleteForm("affiliations")} />;
      case "investment-advisory-agreement":
        return <div>Investment Advisory Agreement Form</div>;
      case "disclosures":
        return <div>Disclosures Form</div>;
      case "custodian-agreement":
        return <div>Custodian Agreement Form</div>;
      case "trusts":
        return <TrustsForm onSave={() => handleCloseForm()} />;
      case "security":
        return <SecurityForm onSave={() => handleCloseForm()} />;
      default:
        return null;
    }
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
          
          <div className="flex items-center mt-2 md:mt-0 gap-2">
            <div className="relative">
              <Button 
                variant="outline" 
                onClick={() => {
                  const contextMenu = document.getElementById("profile-context-menu");
                  if (contextMenu) {
                    contextMenu.classList.toggle("hidden");
                  }
                }}
              >
                Profile Options
              </Button>
              <div 
                id="profile-context-menu" 
                className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-background border border-border z-10 hidden"
              >
                <div className="py-1">
                  {["Profile", "Contact Info", "Additional Info", "Beneficiaries", "Affiliations", "Trusts", "Security & Access", "Change Theme", "Log Out"].map((item) => (
                    <button 
                      key={item} 
                      className="text-left w-full px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        document.getElementById("profile-context-menu")?.classList.add("hidden");
                        handleOpenForm(item.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and"));
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardCard title="Account Summary" className="min-h-[300px]">
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-center">
                  No Account Summary<br />
                  <span className="text-sm">Complete the setup checklist to connect a Farther managed account.</span>
                </p>
              </div>
            </DashboardCard>
          </div>

          <div className="lg:col-span-1">
            <SetupChecklist 
              items={checklistItems} 
              onItemClick={(itemId) => handleOpenForm(itemId)} 
            />
          </div>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto" side="right">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              {activeForm === "investor-profile" && "Investor Profile"}
              {activeForm === "contact-information" && "Contact Information"}
              {activeForm === "additional-information" && "Additional Information"}
              {activeForm === "beneficiaries" && "Beneficiaries"}
              {activeForm === "affiliations" && "Affiliations"}
              {activeForm === "trusts" && "Trusts"}
              {activeForm === "security-and-access" && "Security & Access"}
              {activeForm === "investment-advisory-agreement" && "Investment Advisory Agreement"}
              {activeForm === "disclosures" && "Disclosures"}
              {activeForm === "custodian-agreement" && "Custodian Agreement"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {renderFormContent()}
          </div>
        </SheetContent>
      </Sheet>
    </ThreeColumnLayout>
  );
};

export default CustomerProfile;
