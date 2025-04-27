
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface SupabaseRequiredNoticeProps {
  feature: string;
}

export function SupabaseRequiredNotice({ feature }: SupabaseRequiredNoticeProps) {
  return (
    <Alert className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Supabase Connection Required</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          To use the {feature} feature, you need to connect this application to Supabase. 
          This allows for database storage and retrieval of your projects and integrations.
        </p>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" size="sm" asChild>
            <a href="https://docs.lovable.dev/integrations/supabase/" target="_blank" rel="noopener noreferrer">
              View Integration Docs
            </a>
          </Button>
          <Button size="sm" variant="default">
            Connect Supabase
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
