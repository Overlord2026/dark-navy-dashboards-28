import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { PropertyOnboarding } from "@/components/properties/PropertyOnboarding";
import { PropertyDashboard } from "@/components/properties/PropertyDashboard";
import { useSearchParams } from "react-router-dom";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter");
  const { subscriptionPlan } = useSubscriptionAccess();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  return (
    <ThreeColumnLayout title="Property Management" activeMainItem="family-wealth">
      <div className="w-full max-w-7xl mx-auto">
        {!hasCompletedOnboarding ? (
          <PropertyOnboarding onComplete={handleOnboardingComplete} />
        ) : (
          <PropertyDashboard initialFilter={filter} />
        )}
      </div>
    </ThreeColumnLayout>
  );
};

export default Properties;