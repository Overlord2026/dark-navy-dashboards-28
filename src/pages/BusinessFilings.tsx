
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { BusinessFilingsTracker } from "@/components/social-security/BusinessFilingsTracker";
import { RequestAssistanceButton } from "@/components/ui/request-assistance-button";
import { ConsultantRequestButton } from "@/components/ui/consultant-request-button";
import { useIsMobile } from "@/hooks/use-mobile";

const BusinessFilings = () => {
  const isMobile = useIsMobile();

  return (
    <ThreeColumnLayout
      activeMainItem="client-business-filings"
      title="Business Filings"
    >
      <div className="w-full space-y-6 animate-fade-in">
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground">
              Track important business filings, deadlines, and compliance
              requirements for your businesses.
            </p>
          </div>
          {isMobile ? (
            <div className="flex gap-2">
              <RequestAssistanceButton
                itemName="Business Filing Management"
                itemType="Business Service"
                pageContext="Business Filings"
                className="flex-1"
              />
              <ConsultantRequestButton
                itemName="Business Compliance"
                itemType="Business Service"
                pageContext="Business Filings"
                className="flex-1"
              />
            </div>
          ) : (
            <div className="flex justify-end gap-2">
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
          )}
        </div>

        <BusinessFilingsTracker />
      </div>
    </ThreeColumnLayout>
  );
};

export default BusinessFilings;
