
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProfileForm } from "./ProfileForm";
import { ContactForm } from "./ContactForm";
import { AdditionalInfoForm } from "./AdditionalInfoForm";
import { BeneficiariesFormNew } from "./BeneficiariesFormNew";
import { AffiliationsFormNew } from "./AffiliationsFormNew";
import { TrustsFormNew } from "./TrustsFormNew";
import { SecurityForm } from "./SecurityForm";

interface ProfileFormSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeForm: string | null;
  onFormSave: (formId: string) => void;
}

export function ProfileFormSheet({ 
  isOpen, 
  onOpenChange, 
  activeForm, 
  onFormSave 
}: ProfileFormSheetProps) {
  const handleFormSave = () => {
    if (activeForm) {
      onFormSave(activeForm);
    }
    onOpenChange(false);
  };

  const renderForm = () => {
    switch (activeForm) {
      case "investor-profile":
        return <ProfileForm onSave={handleFormSave} />;
      case "contact-information":
        return <ContactForm onSave={handleFormSave} />;
      case "additional-information":
        return <AdditionalInfoForm onSave={handleFormSave} />;
      case "beneficiaries":
        return <BeneficiariesFormNew onSave={handleFormSave} />;
      case "affiliations":
        return <AffiliationsFormNew onSave={handleFormSave} />;
      case "trusts":
        return <TrustsFormNew onSave={handleFormSave} />;
      case "security-access":
        return <SecurityForm onSave={handleFormSave} />;
      case "investment-advisory-agreement":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Investment Advisory Agreement</h2>
            <p className="text-muted-foreground">Investment advisory agreement content will be displayed here.</p>
          </div>
        );
      case "disclosures":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Disclosures</h2>
            <p className="text-muted-foreground">Disclosure documents will be displayed here.</p>
          </div>
        );
      case "custodian-agreement":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Custodian Agreement</h2>
            <p className="text-muted-foreground">Custodian agreement will be displayed here.</p>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Form Not Found</h2>
            <p className="text-muted-foreground">The requested form could not be found.</p>
          </div>
        );
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
        return "Profile Form";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-4xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{getFormTitle()}</SheetTitle>
        </SheetHeader>
        {renderForm()}
      </SheetContent>
    </Sheet>
  );
}
