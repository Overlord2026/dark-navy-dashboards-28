
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
import { 
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

const CustomerProfile = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAdvisorDrawerOpen, setIsAdvisorDrawerOpen] = useState(false);

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
          
          {/* Move profile dropdown to absolute position in the sidebar in ThreeColumnLayout */}
          <div className="hidden">
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

      {/* Fixed Position Elements */}
      <div className="fixed top-0 left-0 z-40 w-[220px] pt-4 px-5">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between w-full py-2 hover:bg-[#1c2e4a] rounded-md transition-colors cursor-pointer">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white font-medium mr-3">
                AG
              </div>
              <span className="font-medium">Antonio Gomez</span>
            </div>
            <ChevronRight className="h-4 w-4 rotate-90" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[220px] bg-[#0a1021] border-gray-700 text-white">
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

      {/* Advisor Section */}
      <div className="fixed bottom-0 left-0 z-40 w-[220px] p-4">
        <div 
          className="flex items-center justify-between w-full p-2 hover:bg-[#1c2e4a] rounded-md transition-colors cursor-pointer"
          onClick={() => setIsAdvisorDrawerOpen(true)}
        >
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white font-medium mr-3">
              DH
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Advisor</span>
              <span className="font-medium text-sm">Daniel Herrera</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto bg-[#0a1021] text-white" side="right">
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold text-white">
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

      <Drawer open={isAdvisorDrawerOpen} onOpenChange={setIsAdvisorDrawerOpen}>
        <DrawerContent className="bg-[#0a1021] text-white">
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle className="text-xl font-semibold text-white">Advisor Details</DrawerTitle>
              <DrawerDescription className="text-gray-400">
                Your dedicated financial advisor
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-medium">
                  DH
                </div>
                <div>
                  <h3 className="font-medium text-lg">Daniel Herrera</h3>
                  <p className="text-gray-400">Certified Financial Planner™</p>
                </div>
              </div>
              
              <div className="pt-4 space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-400">Email</div>
                  <div>daniel.herrera@farther.com</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-400">Phone</div>
                  <div>(800) 555-1234</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-400">Office</div>
                  <div>New York, NY</div>
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button className="bg-white text-[#0a1021] hover:bg-white/90">
                Schedule a Meeting
              </Button>
              <DrawerClose asChild>
                <Button variant="outline" className="border-gray-700 text-white hover:bg-[#1c2e4a]">
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </ThreeColumnLayout>
  );
};

export default CustomerProfile;
