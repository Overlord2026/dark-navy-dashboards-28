
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FamilyMembersList } from "@/components/family/FamilyMembersList";

export default function ClientFamily() {

  return (
    <ThreeColumnLayout activeMainItem="client-family" title="Family Members">
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your family members and their access to your financial information
          </p>
        </div>

        <div className="space-y-6">
          <FamilyMembersList />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
