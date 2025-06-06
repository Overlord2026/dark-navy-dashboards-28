
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { BusinessFilingsTracker } from "@/components/social-security/BusinessFilingsTracker";
import { RequestAssistanceButton } from "@/components/ui/request-assistance-button";
import { ConsultantRequestButton } from "@/components/ui/consultant-request-button";

const BusinessFilings = () => {
  return (
    <ThreeColumnLayout activeMainItem="client-business-filings" title="Business Filings">
      <div className="w-full space-y-6 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Business Filings & Alerts</h1>
            <p className="text-muted-foreground">
              Track important business filings, deadlines, and compliance requirements for your businesses.
            </p>
          </div>
          <div className="flex gap-2">
            <RequestAssistanceButton 
              itemName="Business Filing Management" 
              itemType="Business Service"
              pageContext="Business Filings"
            />
            <ConsultantRequestButton 
              itemName="Business Compliance" 
              itemType="Business Service"
              pageContext="Business Filings"
            />
          </div>
        </div>
        
        <BusinessFilingsTracker />
      </div>
    </ThreeColumnLayout>
  );
};

export default BusinessFilings;
