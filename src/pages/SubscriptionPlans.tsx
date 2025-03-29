
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { SubscriptionTiers } from "@/components/education/SubscriptionTiers";
import { subscriptionTiers } from "@/data/education/subscriptionTiers";
import { useSubscription } from "@/context/SubscriptionContext";
import { toast } from "sonner";

const SubscriptionPlans = () => {
  const { currentTier, updateSubscription } = useSubscription();
  
  const handleSubscribe = (plan: any) => {
    updateSubscription(plan.id);
    toast.success(`Successfully subscribed to ${plan.name}!`);
  };
  
  return (
    <ThreeColumnLayout activeMainItem="education" title="Subscription Plans">
      <div className="container mx-auto py-8 px-4">
        <SubscriptionTiers 
          tiers={subscriptionTiers} 
          currentTier={currentTier}
          onSubscribe={handleSubscribe}
        />
      </div>
    </ThreeColumnLayout>
  );
};

export default SubscriptionPlans;
