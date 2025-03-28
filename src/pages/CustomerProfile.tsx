
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
  Info,
  UserIcon,
  PhoneIcon,
  FileTextIcon,
  UsersIcon,
  BuildingIcon,
  LockIcon,
  PaletteIcon,
  LogOutIcon
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

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
      case "profile":
        return <ProfileForm onSave={() => handleCompleteForm("investor-profile")} />;
      case "contact-info":
        return <ContactForm onSave={() => handleCompleteForm("contact-information")} />;
      case "additional-info":
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
      case "security-access":
        return <SecurityForm onSave={() => handleCloseForm()} />;
      default:
        return null;
    }
  };

  const menuItems = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "contact-info", label: "Contact Info", icon: PhoneIcon },
    { id: "additional-info", label: "Additional Info", icon: FileTextIcon },
    { id: "beneficiaries", label: "Beneficiaries", icon: UsersIcon },
    { id: "affiliations", label: "Affiliations", icon: BuildingIcon },
    { id: "trusts", label: "Trusts", icon: BuildingIcon },
    { id: "security-access", label: "Security & Access", icon: LockIcon },
    { id: "change-theme", label: "Change Theme", icon: PaletteIcon },
    { id: "log-out", label: "Log Out", icon: LogOutIcon },
  ];

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Profile Options</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#0a1021] border-gray-700 text-white">
                {menuItems.slice(0, 7).map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem 
                      key={item.id}
                      onClick={() => handleOpenForm(item.id)}
                      className="py-2.5 cursor-pointer hover:bg-[#1c2e4a]"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator className="bg-gray-700" />
                {menuItems.slice(7).map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem 
                      key={item.id}
                      className="py-2.5 cursor-pointer hover:bg-[#1c2e4a]"
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      <span>{item.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
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
              {activeForm === "profile" && "Investor Profile"}
              {activeForm === "contact-info" && "Contact Information"}
              {activeForm === "additional-info" && "Additional Information"}
              {activeForm === "beneficiaries" && "Beneficiaries"}
              {activeForm === "affiliations" && "Affiliations"}
              {activeForm === "trusts" && "Trusts"}
              {activeForm === "security-access" && "Security & Access"}
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
