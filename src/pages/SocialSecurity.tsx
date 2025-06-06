
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { SocialSecurityTracker } from "@/components/social-security/SocialSecurityTracker";

const SocialSecurity = () => {
  return (
    <ThreeColumnLayout activeMainItem="client-social-security" title="Social Security & Retirement">
      <div className="w-full space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold mb-2">Social Security & Retirement</h1>
          <p className="text-muted-foreground">
            Track social security benefits for your family.
          </p>
        </div>
        
        <SocialSecurityTracker />
      </div>
    </ThreeColumnLayout>
  );
};

export default SocialSecurity;
