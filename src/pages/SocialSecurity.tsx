
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { SocialSecurityTracker } from "@/components/social-security/SocialSecurityTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestAssistanceButton } from "@/components/ui/request-assistance-button";
import { ConsultantRequestButton } from "@/components/ui/consultant-request-button";

const SocialSecurity = () => {
  return (
    <ThreeColumnLayout activeMainItem="client-social-security" title="Social Security & Retirement">
      <div className="w-full space-y-6 animate-fade-in">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Social Security & Retirement</h1>
            <p className="text-muted-foreground">
              Track social security benefits for your family.
            </p>
          </div>
          <div className="flex gap-2">
            <RequestAssistanceButton 
              itemName="Social Security Planning" 
              itemType="Retirement Service"
              pageContext="Social Security"
            />
            <ConsultantRequestButton 
              itemName="Social Security Optimization" 
              itemType="Retirement Service"
              pageContext="Social Security"
            />
          </div>
        </div>
        
        <SocialSecurityTracker />
      </div>
    </ThreeColumnLayout>
  );
};

export default SocialSecurity;
