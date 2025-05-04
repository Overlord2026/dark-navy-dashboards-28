
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database } from "lucide-react";

export const SupabaseRequiredNotice = () => {
  return (
    <Alert className="bg-amber-50 border-amber-200 text-amber-800">
      <Database className="h-4 w-4" />
      <AlertTitle>Supabase Connection Required</AlertTitle>
      <AlertDescription>
        API integrations require a configured Supabase database connection.
        Configure your connection in the project settings.
      </AlertDescription>
    </Alert>
  );
};
