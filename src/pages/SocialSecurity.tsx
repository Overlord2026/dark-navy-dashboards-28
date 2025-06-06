
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { SocialSecurityTracker } from "@/components/social-security/SocialSecurityTracker";

const SocialSecurity = () => {
  return (
    <ThreeColumnLayout activeMainItem="client-social-security" title="Social Security & Retirement">
      <div className="w-full space-y-6 animate-fade-in">
        <p className="text-muted-foreground">
          Track social security benefits for your family.
        </p>
        
        <SocialSecurityTracker />
      </div>
    </ThreeColumnLayout>
  );
};

export default SocialSecurity;
