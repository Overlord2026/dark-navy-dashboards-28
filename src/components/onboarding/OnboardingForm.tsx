
import React from "react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ContactForm } from "@/components/profile/ContactForm";
import { AdditionalInfoForm } from "@/components/profile/AdditionalInfoForm";
import { BeneficiariesForm } from "@/components/profile/BeneficiariesForm";
import { AffiliationsForm } from "@/components/profile/AffiliationsForm";
import { TrustsForm } from "@/components/profile/TrustsForm";
import { SecurityForm } from "@/components/profile/SecurityForm";

interface OnboardingFormProps {
  formId: string;
}

export const OnboardingForm = ({ formId }: OnboardingFormProps) => {
  const handleFormSave = () => {
    console.log(`Form ${formId} saved`);
    // Handle form save logic here
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
