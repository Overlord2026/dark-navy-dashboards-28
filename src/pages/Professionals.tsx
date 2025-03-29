
import React, { useState } from "react";
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { ProfessionalsDirectory } from "@/components/professionals/ProfessionalsDirectory";
import { AddProfessionalDialog } from "@/components/professionals/AddProfessionalDialog";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function Professionals() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <ThreeColumnLayout activeMainItem="professionals" title="Professional Directory">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Professional Directory</h1>
            <p className="text-muted-foreground mt-1">
              Manage your family's professional service providers
            </p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus size={16} />
            Add Professional
          </Button>
        </div>

        <ProfessionalsDirectory />

        <AddProfessionalDialog 
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    </ThreeColumnLayout>
  );
}
