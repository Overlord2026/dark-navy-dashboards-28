
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database } from "lucide-react";

export const SupabaseRequiredNotice: React.FC = () => {
  return (
    <Alert className="bg-amber-500/10 border-amber-500/20 text-amber-500">
      <Database className="h-4 w-4" />
      <AlertTitle>Database Required</AlertTitle>
      <AlertDescription>
        This feature requires Supabase database integration to store connection data.
      </AlertDescription>
    </Alert>
  );
};
