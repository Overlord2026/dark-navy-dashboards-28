
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddFamilyMemberDialog } from "@/components/family/AddFamilyMemberDialog";
import { FamilyMembersList } from "@/components/family/FamilyMembersList";

export default function ClientFamily() {

  return (
    <ThreeColumnLayout activeMainItem="client-family" title="Family Members">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage your family members and their access to your financial information
            </p>
          </div>
          <div className="flex-shrink-0">
            <AddFamilyMemberDialog>
              <Button className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Family Member
              </Button>
            </AddFamilyMemberDialog>
          </div>
        </div>

        <div className="space-y-6">
          <FamilyMembersList />
        </div>
      </div>
    </ThreeColumnLayout>
  );
}
