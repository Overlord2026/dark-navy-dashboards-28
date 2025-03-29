
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { SocialSecurityTracker } from "@/components/social-security/SocialSecurityTracker";

const SocialSecurity = () => {
  return (
    <ThreeColumnLayout activeMainItem="social-security" title="Social Security">
      <div className="w-full space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Social Security Benefits</h1>
        <p className="text-muted-foreground">
          Link family members' SSA.gov accounts to view and compare retirement benefit estimates at different ages.
        </p>
        <SocialSecurityTracker />
      </div>
    </ThreeColumnLayout>
  );
};

export default SocialSecurity;
