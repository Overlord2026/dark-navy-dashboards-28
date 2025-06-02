
import React from "react";
import { ConsultationsPrompt } from "@/components/professionals/ConsultationsPrompt";
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
      {/* <ConsultationsPrompt /> */}
      
      <ProfessionalsDirectory />
    </div>
  );
}
