
import React from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface ProfessionalsHeaderProps {
  onAddProfessional: () => void;
}

export function ProfessionalsHeader({ onAddProfessional }: ProfessionalsHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Service Professionals</h1>
        <p className="text-muted-foreground mt-1">
          Manage your professional service providers and share documents securely
        </p>
      </div>
      <Button 
        onClick={onAddProfessional}
        className="flex items-center gap-2"
      >
        <UserPlus size={16} />
        Add Professional
      </Button>
    </div>
  );
}
