
import React from "react";
import { useLocation } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { CPASignupForm } from "@/components/professionals/CPASignupForm";
import { ProfessionalsProvider } from "@/contexts/ProfessionalsContext";

export default function ProfessionalSignup() {
  const location = useLocation();
  const { professionalType } = location.state || { professionalType: "Tax Professional / Accountant" };
  
  return (
    <ThreeColumnLayout activeMainItem="professionals" title="Professional Signup">
      <ProfessionalsProvider>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Professional Registration</h1>
            <p className="text-muted-foreground mt-1">
              Create your profile to join our professional network
            </p>
          </div>
          
          {/* For now, we only have the CPA form, but this could be expanded */}
          <CPASignupForm />
        </div>
      </ProfessionalsProvider>
    </ThreeColumnLayout>
  );
}
