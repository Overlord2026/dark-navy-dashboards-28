
import React from "react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ContactForm } from "@/components/profile/ContactForm";
import { AdditionalInfoForm } from "@/components/profile/AdditionalInfoForm";
import { BeneficiariesForm } from "@/components/profile/BeneficiariesForm";
import { AffiliationsForm } from "@/components/profile/AffiliationsForm";
import { TrustsForm } from "@/components/profile/TrustsForm";
import { SecurityForm } from "@/components/profile/SecurityForm";
import { toast } from "sonner";

interface OnboardingFormProps {
  formId: string;
  onFormSave?: (formId: string) => void;
}

export const OnboardingForm = ({ formId, onFormSave }: OnboardingFormProps) => {
  const handleFormSave = () => {
    console.log(`Form ${formId} saved`);
    toast.success(`${formId} information saved successfully`);
    
    // Call the parent's onFormSave with the current form ID
    if (onFormSave) {
      onFormSave(formId);
    }
  };

  switch (formId) {
    case "investor-profile":
      return <ProfileForm onSave={handleFormSave} />;
    case "contact-information":
      return <ContactForm onSave={handleFormSave} />;
    case "additional-information":
      return <AdditionalInfoForm onSave={handleFormSave} />;
    case "beneficiaries":
      return <BeneficiariesForm onSave={handleFormSave} />;
    case "affiliations":
      return <AffiliationsForm onSave={handleFormSave} />;
    case "trusts":
      return <TrustsForm onSave={handleFormSave} />;
    case "security-access":
      return <SecurityForm onSave={handleFormSave} />;
    default:
      return <div>Select a form to continue</div>;
  }
};
