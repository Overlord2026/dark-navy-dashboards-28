
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";

const Billing = () => {
  return (
    <ThreeColumnLayout activeMainItem="home" title="Billing">
      <div className="mx-auto w-full max-w-6xl p-4">
        <div className="bg-card rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Your billing and subscription information will appear here.
          </p>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default Billing;
