
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { AdvisorFeedbackForm } from "@/components/advisor/AdvisorFeedbackForm";

export default function AdvisorFeedback() {
  return (
    <ThreeColumnLayout activeMainItem="advisor" title="Advisor Feedback">
      <div className="space-y-6 p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Advisor Feedback</h1>
          <p className="text-muted-foreground mt-1">
            Help us improve our platform by sharing your experience
          </p>
        </div>
        
        <AdvisorFeedbackForm />
      </div>
    </ThreeColumnLayout>
  );
}
