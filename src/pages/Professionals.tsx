
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { ProfessionalsDirectory } from "@/components/professionals/ProfessionalsDirectory";
import { ProfessionalsProvider } from "@/hooks/useProfessionals";

export default function Professionals() {
  const { sectionId } = useParams<{ sectionId?: string }>();
  
  return (
    <ProfessionalsProvider>
      <ThreeColumnLayout 
        title="Professionals" 
        activeMainItem="professionals"
        activeSecondaryItem={sectionId}
        secondaryMenuItems={[
          { id: "directory", name: "Professional Directory", active: !sectionId || sectionId === "directory" },
          { id: "invitations", name: "Pending Invitations" },
          { id: "settings", name: "Access Settings" },
        ]}
      >
        <div className="space-y-6 w-full max-w-6xl">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Professional Access</h1>
          </div>
          
          {(!sectionId || sectionId === "directory") && (
            <ProfessionalsDirectory />
          )}
          
          {sectionId === "invitations" && (
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-4">Pending Invitations</h2>
              <p className="text-muted-foreground">
                No pending invitations at this time.
              </p>
            </div>
          )}
          
          {sectionId === "settings" && (
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-4">Access Settings</h2>
              <p className="text-muted-foreground">
                Configure professional access settings and permissions.
              </p>
            </div>
          )}
        </div>
      </ThreeColumnLayout>
    </ProfessionalsProvider>
  );
}
