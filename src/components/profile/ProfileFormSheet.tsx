
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        return <div>Investor Profile Form</div>;
      case "contact-information":
        return <div>Contact Information Form</div>;
      case "additional-information":
        return <div>Additional Information Form</div>;
      case "beneficiaries":
        return <div>Beneficiaries Form</div>;
      case "affiliations":
        return <div>Affiliations Form</div>;
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
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto bg-[#0F0F2D] text-white border-l border-gray-800" side="right">
        <div className="flex items-center justify-between mb-6">
          <SheetTitle className="text-xl font-semibold text-white">
            {getFormTitle()}
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </div>
        <div>
          {renderFormContent()}
        </div>
      </SheetContent>
    </Sheet>
  );
};
