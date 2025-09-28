import { useEffect } from "react";
import { logLegacy } from "@/lib/telemetry";
import { useUserPlanKey } from "@/hooks/useUserPlanKey";

interface LegacyWizardProps {
  householdId: string;
}

export default function LegacyWizard({ householdId }: LegacyWizardProps) {
  const planKey = useUserPlanKey();

  useEffect(() => {
    logLegacy("legacy.flow_started", { household_id: householdId, plan_key: planKey });
  }, [householdId, planKey]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Legacy Planning Wizard</h1>
      <p className="text-muted-foreground mb-4">
        Welcome to the legacy planning process. We'll guide you through creating a comprehensive plan.
      </p>
      
      {/* Placeholder for wizard content */}
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-2">Step 1: Basic Information</h2>
          <p className="text-sm text-muted-foreground">
            Household ID: {householdId} | Plan: {planKey}
          </p>
        </div>
      </div>
    </div>
  );
}