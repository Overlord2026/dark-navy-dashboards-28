
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const SupabaseRequiredNotice: React.FC = () => {
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Integration Status</AlertTitle>
      <AlertDescription>
        This project is connected to the Family Office Marketplace ecosystem.
      </AlertDescription>
    </Alert>
  );
};
