
import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { SocialSecurityTracker } from "@/components/social-security/SocialSecurityTracker";
import { RetirementAccountTracker } from "@/components/social-security/RetirementAccountTracker";
import { BusinessFilingsTracker } from "@/components/social-security/BusinessFilingsTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SocialSecurity = () => {
  return (
    <ThreeColumnLayout activeMainItem="social-security" title="Social Security & Retirement">
      <div className="w-full space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Retirement Benefits</h1>
        <p className="text-muted-foreground">
          Track social security benefits, retirement accounts, and business filings for your family.
        </p>
        
        <Tabs defaultValue="social-security" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social-security">Social Security</TabsTrigger>
            <TabsTrigger value="retirement-accounts">401K/457/403B Accounts</TabsTrigger>
            <TabsTrigger value="business-filings">Business Filings</TabsTrigger>
          </TabsList>
          <TabsContent value="social-security" className="pt-4">
            <SocialSecurityTracker />
          </TabsContent>
          <TabsContent value="retirement-accounts" className="pt-4">
            <RetirementAccountTracker />
          </TabsContent>
          <TabsContent value="business-filings" className="pt-4">
            <BusinessFilingsTracker />
          </TabsContent>
        </Tabs>
      </div>
    </ThreeColumnLayout>
  );
};

export default SocialSecurity;
