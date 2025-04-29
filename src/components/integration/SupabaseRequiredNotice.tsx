
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SupabaseRequiredNotice = () => {
  return (
    <Alert className="bg-amber-900/20 text-amber-200 border-amber-500/50 mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Supabase Integration Required</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span>Connect your Supabase instance to enable full integration functionality.</span>
        <Button size="sm" className="bg-black text-[#D4AF37] hover:bg-black/80 whitespace-nowrap">
          Configure Supabase
        </Button>
      </AlertDescription>
    </Alert>
  );
};
