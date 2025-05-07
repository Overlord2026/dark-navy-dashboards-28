
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export const SupabaseRequiredNotice = () => {
  return (
    <Alert className="mb-6">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Supabase Integration Required</AlertTitle>
      <AlertDescription>
        Some features require Supabase integration. Please connect your Supabase project to enable full functionality.
      </AlertDescription>
    </Alert>
  );
};
