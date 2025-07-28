import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { BillPayOnboarding } from "@/components/billpay/BillPayOnboarding";
import { BillPayDashboard } from "@/components/billpay/BillPayDashboard";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";

const BillPay = () => {
  const { subscriptionPlan } = useSubscriptionAccess();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  return (
    <ThreeColumnLayout title="Bill Pay">
      {!hasCompletedOnboarding ? (
        <BillPayOnboarding onComplete={handleOnboardingComplete} />
      ) : (
        <BillPayDashboard />
      )}
    </ThreeColumnLayout>
  );
};

export default BillPay;