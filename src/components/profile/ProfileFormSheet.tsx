
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ContactForm } from "@/components/profile/ContactForm";
import { AdditionalInfoForm } from "@/components/profile/AdditionalInfoForm";
import { BeneficiariesForm } from "@/components/profile/BeneficiariesForm";
import { AffiliationsForm } from "@/components/profile/AffiliationsForm";
import { TrustsForm } from "@/components/profile/TrustsForm";
import { SecurityForm } from "@/components/profile/SecurityForm";

interface ProfileFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeForm: string | null;
  onFormSave: (formId: string) => void;
}

export const ProfileFormSheet = ({ 
  isOpen, 
  onOpenChange, 
  activeForm, 
  onFormSave 
}: ProfileFormSheetProps) => {
  const renderFormContent = () => {
    switch (activeForm) {
      case "investor-profile":
        return <ProfileForm onSave={() => onFormSave("investor-profile")} />;
      case "contact-information":
        return <ContactForm onSave={() => onFormSave("contact-information")} />;
      case "additional-information":
        return <AdditionalInfoForm onSave={() => onFormSave("additional-information")} />;
      case "beneficiaries":
        return <BeneficiariesForm onSave={() => onFormSave("beneficiaries")} />;
      case "affiliations":
        return <AffiliationsForm onSave={() => onFormSave("affiliations")} />;
      case "trusts":
        return <TrustsForm onSave={() => onFormSave("trusts")} />;
      case "security-access":
        return <SecurityForm onSave={() => onFormSave("security-access")} />;
      case "investment-advisory-agreement":
        return <div>Investment Advisory Agreement Form</div>;
      case "disclosures":
        return <div>Disclosures Form</div>;
      case "custodian-agreement":
        return <div>Custodian Agreement Form</div>;
      default:
        return null;
    }
  };

  const getFormTitle = () => {
    switch (activeForm) {
      case "investor-profile":
        return "Investor Profile";
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
      case "security-access":
        return "Security & Access";
      case "investment-advisory-agreement":
        return "Investment Advisory Agreement";
      case "disclosures":
        return "Disclosures";
      case "custodian-agreement":
        return "Custodian Agreement";
      default:
        return "";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto bg-[#0A0A23] text-white border-l border-gray-800" side="right">
        <div className="flex items-center justify-between mb-2 py-2 px-4 border border-gray-700/20 rounded-md">
          <div className="flex items-center">
            <SheetTitle className="text-xl font-semibold text-white">
              {getFormTitle()}
            </SheetTitle>
            {activeForm === "affiliations" && (
              <ChevronDown className="h-5 w-5 ml-2 text-white/70" />
            )}
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
