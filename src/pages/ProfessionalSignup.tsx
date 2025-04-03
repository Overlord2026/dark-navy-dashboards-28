
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CPASignupForm } from "@/components/professionals/CPASignupForm";
import { useLocation } from "react-router-dom";
import { ProfessionalsProvider } from "@/hooks/useProfessionals";

export default function ProfessionalSignup() {
  const location = useLocation();
  // Check if there's a professional type in the location state
  const professionalType = location.state?.professionalType || "Tax Professional / Accountant";
  
  return (
    <ProfessionalsProvider>
      <ThreeColumnLayout activeMainItem="professionals" title="Professional Signup">
        <div className="space-y-6 animate-fade-in p-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Professional Signup</h1>
            <p className="text-muted-foreground mt-1">
              Complete your profile to join our marketplace of trusted professionals
            </p>
          </div>

          {professionalType === "Tax Professional / Accountant" && <CPASignupForm />}
          {/* We can add other professional type forms here in the future */}
        </div>
      </ThreeColumnLayout>
    </ProfessionalsProvider>
  );
}
