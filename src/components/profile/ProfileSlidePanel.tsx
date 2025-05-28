
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { X, ChevronDown } from "lucide-react";
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

export const ProfileSlidePanel = ({ 
  isOpen, 
  onOpenChange, 
  activeForm 
}: ProfileSlidePanelProps) => {
  
  const handleFormSave = (formType: string) => {
    toast.success(`${getFormTitle()} saved successfully`);
    // Close the panel after successful save
    setTimeout(() => {
      onOpenChange(false);
    }, 1000);
  };

  const renderFormContent = () => {
    if (!activeForm) return null;
    
    switch (activeForm) {
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
    switch (activeForm) {
      case "contact-information":
        return "Contact Information";
      case "additional-information":
        return "Additional Information";
      case "beneficiaries":
        return "Beneficiaries";
      case "affiliations":
        return "Affiliations";
      case "trusts":
        return "Trusts";
      case "investor-profile":
        return "Investor Profile";
      default:
        return "";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[600px] overflow-y-auto bg-[#0A0A23] text-white border-l border-gray-800" side="right">
        <div className="flex items-center justify-between mb-6 py-4 px-2 border border-gray-700/20 rounded-md">
          <div className="flex items-center">
            <SheetTitle className="text-xl font-semibold text-white">
              {getFormTitle()}
            </SheetTitle>
            <ChevronDown className="h-5 w-5 ml-2 text-white/70" />
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>
        <div className="mt-4">
          {renderFormContent()}
        </div>
      </SheetContent>
    </Sheet>
  );
};
