
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { BusinessFilingsTracker } from "@/components/social-security/BusinessFilingsTracker";

const BusinessFilings = () => {
  return (
    <ThreeColumnLayout activeMainItem="client-business-filings" title="Business Filings">
      <div className="w-full space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Business Filings & Alerts</h1>
        <p className="text-muted-foreground">
          Track important business filings, deadlines, and compliance requirements for your businesses.
        </p>
        
        <BusinessFilingsTracker />
      </div>
    </ThreeColumnLayout>
  );
};

export default BusinessFilings;
