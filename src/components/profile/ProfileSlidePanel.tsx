
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ContactInfoForm } from "./ContactInfoForm";
import { AdditionalInfoForm } from "./AdditionalInfoForm";
import { BeneficiariesFormNew } from "./BeneficiariesFormNew";
import { AffiliationsFormNew } from "./AffiliationsFormNew";
import { TrustsFormNew } from "./TrustsFormNew";
import { ProfileForm } from "./ProfileForm";
import { toast } from "sonner";

interface ProfileSlidePanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeForm: string | null;
}

const formOptions = [
  { id: "investor-profile", label: "Investor Profile" },
  { id: "contact-information", label: "Contact Information" },
  { id: "additional-information", label: "Additional Information" },
  { id: "beneficiaries", label: "Beneficiaries" },
  { id: "affiliations", label: "Affiliations" },
  { id: "trusts", label: "Trusts" },
];

export const ProfileSlidePanel = ({ 
  isOpen, 
  onOpenChange, 
  activeForm 
}: ProfileSlidePanelProps) => {
  const [currentForm, setCurrentForm] = useState(activeForm);
  
  useEffect(() => {
    setCurrentForm(activeForm);
  }, [activeForm]);
  
  const handleFormSave = (formType: string) => {
    toast.success(`${getFormTitle()} saved successfully`);
    // Close the panel after successful save
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };

  const handleFormChange = (formId: string) => {
    setCurrentForm(formId);
  };

  const renderFormContent = () => {
    if (!currentForm) return null;
    
    switch (currentForm) {
      case "contact-information":
        return <ContactInfoForm onSave={() => handleFormSave("contact-information")} />;
      case "additional-information":
        return <AdditionalInfoForm onSave={() => handleFormSave("additional-information")} />;
      case "beneficiaries":
        return <BeneficiariesFormNew onSave={() => handleFormSave("beneficiaries")} />;
      case "affiliations":
        return <AffiliationsFormNew onSave={() => handleFormSave("affiliations")} />;
      case "trusts":
        return <TrustsFormNew onSave={() => handleFormSave("trusts")} />;
      case "investor-profile":
        return <ProfileForm onSave={() => handleFormSave("investor-profile")} />;
      default:
        return <div className="text-white p-4">Form not available</div>;
    }
  };

  const getFormTitle = () => {
    const option = formOptions.find(opt => opt.id === currentForm);
    return option ? option.label : "";
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto bg-[#0A0A23] text-white border-l border-gray-800" side="right">
        <SheetHeader className="mb-6 py-3 px-3 border border-gray-700/20 rounded-xl bg-gradient-to-r from-gray-800/20 to-gray-700/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center justify-between w-full h-10 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                <SheetTitle className="text-lg font-medium text-white truncate">
                  {getFormTitle()}
                </SheetTitle>
                <ChevronDown className="h-4 w-4 ml-2 text-white/70 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-64 bg-[#1B1B32] border-[#2A2A40] shadow-xl shadow-black/20 rounded-xl"
            >
              {formOptions.map((option) => (
                <DropdownMenuItem 
                  key={option.id}
                  onClick={() => handleFormChange(option.id)}
                  className="text-white hover:bg-[#2A2A40] focus:bg-[#2A2A40] cursor-pointer rounded-lg mx-1 my-0.5 transition-colors"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SheetHeader>
        <div className="mt-4">
          {renderFormContent()}
        </div>
      </SheetContent>
    </Sheet>
  );
};
