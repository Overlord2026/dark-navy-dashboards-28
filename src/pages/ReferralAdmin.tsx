import React from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { ReferralManagement } from "@/components/referrals/ReferralManagement";

export default function ReferralAdmin() {
  return (
    <ThreeColumnLayout>
      <div className="space-y-6 px-4 py-2 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Referral Management</h1>
            <p className="text-muted-foreground">
              Manage referral programs, track rewards, and monitor advisor overrides
            </p>
          </div>
        </div>
        
        <ReferralManagement />
      </div>
    </ThreeColumnLayout>
  );
}