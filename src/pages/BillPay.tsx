import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { BillPayOnboarding } from "@/components/billpay/BillPayOnboarding";
import { BillPayDashboard } from "@/components/billpay/BillPayDashboard";
import { useSubscriptionAccess } from "@/hooks/useSubscriptionAccess";
import { BillPayErrorBoundary } from "@/components/billpay/BillPayErrorBoundary";
import { BillPayPerformanceMonitor } from "@/components/debug/BillPayPerformanceMonitor";

const BillPay = () => {
  const { subscriptionPlan } = useSubscriptionAccess();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  return (
    <BillPayErrorBoundary>
      <ThreeColumnLayout title="Bill Pay">
        {!hasCompletedOnboarding ? (
          <BillPayOnboarding onComplete={handleOnboardingComplete} />
        ) : (
          <BillPayDashboard />
        )}
        <BillPayPerformanceMonitor />
      </ThreeColumnLayout>
    </BillPayErrorBoundary>
  );
};

export default BillPay;