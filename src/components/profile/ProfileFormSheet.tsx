
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
      case "profile":
        return <ProfileForm onSave={() => onFormSave("investor-profile")} />;
      case "contact-info":
        return <ContactForm onSave={() => onFormSave("contact-information")} />;
      case "additional-info":
        return <AdditionalInfoForm onSave={() => onFormSave("additional-information")} />;
      case "beneficiaries":
        return <BeneficiariesForm onSave={() => onFormSave("beneficiaries")} />;
      case "affiliations":
        return <AffiliationsForm onSave={() => onFormSave("affiliations")} />;
      case "investment-advisory-agreement":
        return <div>Investment Advisory Agreement Form</div>;
      case "disclosures":
        return <div>Disclosures Form</div>;
      case "custodian-agreement":
        return <div>Custodian Agreement Form</div>;
      case "trusts":
        return <TrustsForm onSave={() => onFormSave("trusts")} />;
      case "security-access":
        return <SecurityForm onSave={() => onFormSave("security-access")} />;
      default:
        return null;
    }
  };

  const getFormTitle = () => {
    switch (activeForm) {
      case "profile":
        return "Investor Profile";
      case "contact-info":
        return "Contact Information";
      case "additional-info":
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
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto bg-[#0a1021] text-white" side="right">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-white">
            {getFormTitle()}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {renderFormContent()}
        </div>
      </SheetContent>
    </Sheet>
  );
};
