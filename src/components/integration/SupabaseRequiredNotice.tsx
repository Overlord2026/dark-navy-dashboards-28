
import React from "react";
import { Card } from "@/components/ui/card";
import { Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SupabaseRequiredNotice() {
  return (
    <Card className="p-4 bg-blue-500/10 border-blue-500/30 flex items-center gap-3">
      <div className="bg-blue-500/20 p-1.5 rounded-full">
        <Info className="h-4 w-4 text-blue-500" />
      </div>
      <div className="flex-1">
        <p className="text-sm">
          To enable full integration functionality, make sure your Supabase instance is properly configured and connected.
        </p>
      </div>
      <Button variant="ghost" size="sm" className="text-blue-500 flex items-center gap-1 whitespace-nowrap">
        Learn More <ExternalLink className="h-3 w-3 ml-1" />
      </Button>
    </Card>
  );
}
