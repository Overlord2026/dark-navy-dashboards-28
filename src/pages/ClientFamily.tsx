
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { FamilyMembersList } from "@/components/family/FamilyMembersList";

export default function ClientFamily() {

  return (
    <ThreeColumnLayout activeMainItem="client-family" title={undefined}>
      <div className="space-y-6 animate-fade-in">
        <div className="space-y-6">
          <FamilyMembersList />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
