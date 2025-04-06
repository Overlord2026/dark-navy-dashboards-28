
import React from "react";
import { ConsultationsPrompt } from "@/components/professionals/ConsultationsPrompt";
import { ProfessionalSignupPrompt } from "@/components/professionals/ProfessionalSignupPrompt";
import { AdvisorFeedbackPrompt } from "@/components/professionals/AdvisorFeedbackPrompt";
import { ProfessionalsDirectory } from "@/components/professionals/ProfessionalsDirectory";
import { ProfessionalType } from "@/types/professional";

interface ProfessionalsTabContentProps {
  professionalType: ProfessionalType;
  setProfessionalType: (type: ProfessionalType) => void;
}

export function ProfessionalsTabContent({ 
  professionalType,
  setProfessionalType
}: ProfessionalsTabContentProps) {
  return (
    <div className="space-y-6">
      <ConsultationsPrompt />
      
      <ProfessionalSignupPrompt 
        professionalType={professionalType}
        setProfessionalType={setProfessionalType}
      />
      
      <AdvisorFeedbackPrompt />
      
      <ProfessionalsDirectory />
    </div>
  );
}
