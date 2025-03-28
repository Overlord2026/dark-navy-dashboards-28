
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
  LogOutIcon,
  MailIcon,
  LinkedinIcon,
  ExternalLinkIcon
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link } from "react-router-dom";

const CustomerProfile = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAdvisorDrawerOpen, setIsAdvisorDrawerOpen] = useState(false);
  const [activeAdvisorTab, setActiveAdvisorTab] = useState("bio");

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

  const advisorInfo = {
    name: "Daniel Herrera",
    title: "Certified Financial Planner™",
    location: "Tampa, FL",
    email: "daniel.herrera@farther.com",
    phone: "(800) 555-1234",
    office: "New York, NY",
    bio: "Daniel, a seasoned finance professional, guides high net worth investors. His approach blends investment management, risk mitigation, tax optimization, and overall strategy. Starting at Vanguard, then UBS, he directed client acquisition at Fisher Investments before joining Farther. Originally from Asheville, NC, Daniel now resides in Tampa, enjoying fitness, community activities, and sunny days by the water."
  };

  const renderAdvisorContent = () => {
    switch (activeAdvisorTab) {
      case "bio":
        return (
          <div className="text-sm text-white/80 mt-4">
            <p>{advisorInfo.bio}</p>
          </div>
        );
      case "location":
        return (
          <div className="text-sm text-white/80 mt-4">
            <p className="mb-2">Office: {advisorInfo.office}</p>
            <p>Location: {advisorInfo.location}</p>
          </div>
        );
      case "education":
        return (
          <div className="text-sm text-white/80 mt-4">
            <p className="mb-2">MBA, Finance - University of Florida</p>
            <p className="mb-2">BS, Business Administration - UNC Chapel Hill</p>
            <p>Certified Financial Planner™ (CFP®)</p>
          </div>
        );
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
          
          {/* Hidden dropdown - functionality moved to sidebar */}
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

        {activeAdvisorTab ? (
          <div className="bg-[#0a1021] rounded-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="rounded-full overflow-hidden w-32 h-32 mb-4 md:mb-0 md:mr-6">
                  <img
                    src="/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png"
                    alt="Daniel Herrera"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-semibold text-white">{advisorInfo.name}</h2>
                  <div className="flex items-center mt-2 text-white/80 space-x-4">
                    <a href={`mailto:${advisorInfo.email}`} className="flex items-center hover:text-white">
                      <MailIcon className="h-4 w-4 mr-2" />
                      <span>{advisorInfo.email}</span>
                    </a>
                  </div>
                  <div className="flex items-center mt-2 text-white/80">
                    <a href="#" className="flex items-center hover:text-white">
                      <LinkedinIcon className="h-4 w-4 mr-2" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
              <Button className="mt-4 md:mt-0 bg-white text-[#0a1021] hover:bg-white/90">
                Book a session
              </Button>
            </div>
            
            <Tabs value={activeAdvisorTab} onValueChange={setActiveAdvisorTab} className="w-full">
              <TabsList className="bg-[#1c2e4a] w-auto inline-flex">
                <TabsTrigger value="bio" className="data-[state=active]:bg-white/10">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Bio
                </TabsTrigger>
                <TabsTrigger value="location" className="data-[state=active]:bg-white/10">
                  <Info className="h-4 w-4 mr-2" />
                  Location
                </TabsTrigger>
                <TabsTrigger value="education" className="data-[state=active]:bg-white/10">
                  <FileTextIcon className="h-4 w-4 mr-2" />
                  Education
                </TabsTrigger>
              </TabsList>
              <TabsContent value={activeAdvisorTab} className="mt-4">
                {renderAdvisorContent()}
              </TabsContent>
            </Tabs>
          </div>
        ) : (
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
        )}
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
        <Popover>
          <PopoverTrigger asChild>
            <div 
              className="flex items-center justify-between w-full p-2 hover:bg-[#1c2e4a] rounded-md transition-colors cursor-pointer"
            >
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white font-medium mr-3">
                  DH
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Advisor</span>
                  <span className="font-medium text-sm">{advisorInfo.name}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </div>
          </PopoverTrigger>
          <PopoverContent align="start" alignOffset={-40} side="top" className="w-64 bg-[#0c1224] border-gray-700 text-white">
            <div className="flex flex-col space-y-3 p-1">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white text-xl font-medium">
                  DH
                </div>
                <div>
                  <p className="font-medium text-sm">{advisorInfo.name}</p>
                  <p className="text-xs text-gray-400">{advisorInfo.title}</p>
                </div>
              </div>
              
              <div className="text-sm text-gray-300">{advisorInfo.location}</div>
              
              <a href={`mailto:${advisorInfo.email}`} className="text-sm text-blue-400 hover:underline flex items-center">
                <MailIcon className="h-3.5 w-3.5 mr-1.5" />
                {advisorInfo.email}
              </a>
              
              <div className="flex flex-col space-y-2 pt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start hover:bg-[#1c2e4a] text-white"
                  onClick={() => {
                    setActiveAdvisorTab("bio");
                    setIsAdvisorDrawerOpen(false);
                  }}
                >
                  <UserIcon className="h-3.5 w-3.5 mr-1.5" />
                  View profile
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start hover:bg-[#1c2e4a] text-white"
                  onClick={() => {
                    setIsAdvisorDrawerOpen(true);
                  }}
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Book a session
                  <ExternalLinkIcon className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
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
        <DrawerContent className="bg-white">
          <div className="mx-auto w-full max-w-4xl p-6">
            <DrawerHeader className="text-center">
              <DrawerTitle className="text-xl font-bold">Book a Meeting with {advisorInfo.name}</DrawerTitle>
              <DrawerDescription>
                Choose a time that works for you
              </DrawerDescription>
            </DrawerHeader>
            
            <div className="flex flex-col md:flex-row gap-6 my-6">
              <div className="flex-1 p-6 bg-[#0a1021] text-white rounded-lg">
                <div className="text-center mb-6">
                  <div className="mx-auto w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                      src="/lovable-uploads/b4df25d6-12d7-4c34-874e-804e72335904.png"
                      alt="Daniel Herrera"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium">Meet with {advisorInfo.name}</h3>
                  <div className="flex items-center justify-center mt-2 text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>March 2023</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-4">
                  <div className="text-xs text-gray-400">SUN</div>
                  <div className="text-xs text-gray-400">MON</div>
                  <div className="text-xs text-gray-400">TUE</div>
                  <div className="text-xs text-gray-400">WED</div>
                  <div className="text-xs text-gray-400">THU</div>
                  <div className="text-xs text-gray-400">FRI</div>
                  <div className="text-xs text-gray-400">SAT</div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <div 
                      key={day}
                      className={`
                        aspect-square flex items-center justify-center rounded-full text-sm
                        ${day === 15 ? 'bg-white text-[#0a1021] font-medium' : 'hover:bg-white/10 cursor-pointer'}
                      `}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-6">
                  <h4 className="font-medium mb-2">How long do you need?</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-gray-100">30 mins</Button>
                    <Button variant="outline" className="flex-1">15 mins</Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">What time works best?</h4>
                  <p className="text-sm text-gray-500 mb-4">Showing times for March 15, 2023</p>
                  
                  <div className="space-y-2">
                    {["10:15 am", "1:15 pm", "3:15 pm", "4:45 pm", "5:30 pm"].map((time) => (
                      <Button 
                        key={time}
                        variant="outline" 
                        className="w-full justify-center text-center"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <DrawerFooter>
              <Button>Continue</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </ThreeColumnLayout>
  );
};

export default CustomerProfile;
